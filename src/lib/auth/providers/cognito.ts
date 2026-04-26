import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  InitiateAuthCommand,
  AuthFlowType,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  UsernameExistsException,
  InvalidParameterException,
  InvalidPasswordException,
  CodeMismatchException,
  ExpiredCodeException,
  NotAuthorizedException,
  UserNotConfirmedException,
  UserNotFoundException,
  LimitExceededException,
} from "@aws-sdk/client-cognito-identity-provider";
import type {
  AuthProvider,
  AuthSession,
  AuthUser,
  SignInInput,
  SignUpInput,
} from "../types";
import { computeSecretHash } from "../cognito-helpers";
import { decodeIdToken, verifyIdToken } from "../jwt-verifier";
import { env } from "@/lib/env";

// Lazy singleton — only instantiated when the first auth call happens, so we
// don't initialize an AWS SDK client at import time when AUTH_PROVIDER=mock.
let _client: CognitoIdentityProviderClient | null = null;

function getClient(): CognitoIdentityProviderClient {
  if (!_client) {
    _client = new CognitoIdentityProviderClient({ region: env.COGNITO_REGION });
  }
  return _client;
}

export const cognitoProvider: AuthProvider = {
  name: "cognito",

  async signUp(
    input: SignUpInput,
  ): Promise<{ userId: string; needsVerification: boolean }> {
    const client = getClient();
    try {
      const result = await client.send(
        new SignUpCommand({
          ClientId: env.COGNITO_CLIENT_ID!,
          Username: input.email,
          Password: input.password,
          SecretHash: computeSecretHash(input.email),
          UserAttributes: [
            { Name: "email", Value: input.email },
            { Name: "name", Value: input.displayName },
            { Name: "custom:role", Value: input.role },
          ],
        }),
      );
      return {
        userId: result.UserSub!,
        needsVerification: !result.UserConfirmed,
      };
    } catch (err) {
      if (err instanceof UsernameExistsException) {
        throw new Error("An account with this email already exists.");
      }
      if (err instanceof InvalidPasswordException) {
        throw new Error(
          "Password does not meet requirements (8+ chars, mix of cases and numbers).",
        );
      }
      if (err instanceof InvalidParameterException) {
        throw new Error(
          "Invalid signup data. Check email format and required fields.",
        );
      }
      throw err;
    }
  },

  async confirmSignUp(email: string, code: string): Promise<void> {
    const client = getClient();
    try {
      await client.send(
        new ConfirmSignUpCommand({
          ClientId: env.COGNITO_CLIENT_ID!,
          Username: email,
          ConfirmationCode: code,
          SecretHash: computeSecretHash(email),
        }),
      );
    } catch (err) {
      if (err instanceof CodeMismatchException) {
        throw new Error("Verification code is incorrect.");
      }
      if (err instanceof ExpiredCodeException) {
        throw new Error("Verification code has expired. Request a new one.");
      }
      throw err;
    }
  },

  async resendVerification(email: string): Promise<void> {
    const client = getClient();
    await client.send(
      new ResendConfirmationCodeCommand({
        ClientId: env.COGNITO_CLIENT_ID!,
        Username: email,
        SecretHash: computeSecretHash(email),
      }),
    );
  },

  async signIn(input: SignInInput): Promise<AuthSession> {
    const client = getClient();
    try {
      const result = await client.send(
        new InitiateAuthCommand({
          ClientId: env.COGNITO_CLIENT_ID!,
          AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
          AuthParameters: {
            USERNAME: input.email,
            PASSWORD: input.password,
            SECRET_HASH: computeSecretHash(input.email),
          },
        }),
      );

      const tokens = result.AuthenticationResult;
      if (!tokens?.IdToken || !tokens.AccessToken || !tokens.RefreshToken) {
        throw new Error("Cognito returned incomplete authentication result.");
      }

      // Verify the IdToken and extract identity from claims.
      const claims = await verifyIdToken(tokens.IdToken);

      const role = claims["custom:role"];
      if (
        !role ||
        !["prospective", "current", "alumni", "admin"].includes(role)
      ) {
        throw new Error(`User has invalid or missing role: ${role}`);
      }

      const expiresAt =
        Math.floor(Date.now() / 1000) + (tokens.ExpiresIn ?? 3600);

      return {
        user: {
          id: claims.sub,
          email: claims.email,
          role: role as AuthUser["role"],
          displayName: claims.name ?? null,
          emailVerified: claims.email_verified,
        },
        // We use IdToken as our session token because it carries custom
        // claims (notably custom:role) — the AccessToken doesn't.
        accessToken: tokens.IdToken,
        refreshToken: tokens.RefreshToken,
        expiresAt,
      };
    } catch (err) {
      if (err instanceof NotAuthorizedException) {
        throw new Error("Incorrect email or password.");
      }
      if (err instanceof UserNotConfirmedException) {
        throw new Error(
          "Account not confirmed. Check your email for the verification code.",
        );
      }
      if (err instanceof UserNotFoundException) {
        throw new Error("No account found with that email.");
      }
      throw err;
    }
  },

  async signOut(_accessToken: string): Promise<void> {
    throw new Error(
      "CognitoProvider.signOut not yet implemented (Phase 2 Step 3b).",
    );
  },

  async getUserFromToken(accessToken: string): Promise<AuthUser> {
    const claims = await verifyIdToken(accessToken);

    const role = claims["custom:role"];
    if (
      !role ||
      !["prospective", "current", "alumni", "admin"].includes(role)
    ) {
      throw new Error(`User has invalid or missing role: ${role}`);
    }

    return {
      id: claims.sub,
      email: claims.email,
      role: role as AuthUser["role"],
      displayName: claims.name ?? null,
      emailVerified: claims.email_verified,
    };
  },

  async refreshSession(
    refreshToken: string,
    idToken: string,
  ): Promise<AuthSession> {
    const client = getClient();

    // Cognito's REFRESH_TOKEN_AUTH flow needs SECRET_HASH when the App
    // Client has a secret. The HMAC must be over the user's `sub` claim
    // (NOT email) — refresh tokens are encrypted (JWE), so we can't read
    // sub from them; we extract it from the existing IdToken instead.
    // The IdToken may be expired by the time refresh is called; we use
    // unverified decode here because the refresh token itself is what's
    // authoritative — we just need sub for the HMAC computation.
    const claims = decodeIdToken(idToken);
    const sub = claims.sub;
    if (!sub) {
      throw new Error("Cannot refresh: existing IdToken has no sub claim.");
    }

    try {
      const result = await client.send(
        new InitiateAuthCommand({
          ClientId: env.COGNITO_CLIENT_ID!,
          AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
          AuthParameters: {
            REFRESH_TOKEN: refreshToken,
            SECRET_HASH: computeSecretHash(sub),
          },
        }),
      );

      const tokens = result.AuthenticationResult;
      if (!tokens?.IdToken) {
        throw new Error("Cognito returned no IdToken on refresh.");
      }

      // Verify the new IdToken; refresh doesn't return a new RefreshToken
      // (caller keeps the old one).
      const claims = await verifyIdToken(tokens.IdToken);

      const role = claims["custom:role"];
      if (
        !role ||
        !["prospective", "current", "alumni", "admin"].includes(role)
      ) {
        throw new Error(`User has invalid or missing role: ${role}`);
      }

      const expiresAt =
        Math.floor(Date.now() / 1000) + (tokens.ExpiresIn ?? 3600);

      return {
        user: {
          id: claims.sub,
          email: claims.email,
          role: role as AuthUser["role"],
          displayName: claims.name ?? null,
          emailVerified: claims.email_verified,
        },
        accessToken: tokens.IdToken,
        refreshToken, // Cognito doesn't rotate it; reuse the input.
        expiresAt,
      };
    } catch (err) {
      if (err instanceof NotAuthorizedException) {
        throw new Error("Refresh token invalid or expired. Sign in again.");
      }
      throw err;
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    const client = getClient();
    try {
      await client.send(
        new ForgotPasswordCommand({
          ClientId: env.COGNITO_CLIENT_ID!,
          Username: email,
          SecretHash: computeSecretHash(email),
        }),
      );
    } catch (err) {
      if (err instanceof LimitExceededException) {
        throw new Error(
          "Too many password reset attempts. Wait a few minutes and try again.",
        );
      }
      // Note: Cognito intentionally returns the same response whether the user
      // exists or not. This is correct behavior — prevents email enumeration
      // attacks. Don't add UserNotFoundException handling.
      throw err;
    }
  },

  async confirmPasswordReset(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    const client = getClient();
    try {
      await client.send(
        new ConfirmForgotPasswordCommand({
          ClientId: env.COGNITO_CLIENT_ID!,
          Username: email,
          ConfirmationCode: code,
          Password: newPassword,
          SecretHash: computeSecretHash(email),
        }),
      );
    } catch (err) {
      if (err instanceof CodeMismatchException) {
        throw new Error("Reset code is incorrect.");
      }
      if (err instanceof ExpiredCodeException) {
        throw new Error("Reset code has expired. Request a new one.");
      }
      if (err instanceof InvalidPasswordException) {
        throw new Error(
          "New password does not meet requirements (8+ chars, mix of cases, numbers, special chars).",
        );
      }
      throw err;
    }
  },
};
