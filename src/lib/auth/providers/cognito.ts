import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  UsernameExistsException,
  InvalidParameterException,
  InvalidPasswordException,
  CodeMismatchException,
  ExpiredCodeException,
} from "@aws-sdk/client-cognito-identity-provider";
import type {
  AuthProvider,
  AuthSession,
  AuthUser,
  SignInInput,
  SignUpInput,
} from "../types";
import { computeSecretHash } from "../cognito-helpers";
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

  async signIn(_input: SignInInput): Promise<AuthSession> {
    throw new Error(
      "CognitoProvider.signIn not yet implemented (Phase 2 Step 3b).",
    );
  },

  async signOut(_accessToken: string): Promise<void> {
    throw new Error(
      "CognitoProvider.signOut not yet implemented (Phase 2 Step 3b).",
    );
  },

  async getUserFromToken(_accessToken: string): Promise<AuthUser> {
    throw new Error(
      "CognitoProvider.getUserFromToken not yet implemented (Phase 2 Step 3b).",
    );
  },

  async refreshSession(_refreshToken: string): Promise<AuthSession> {
    throw new Error(
      "CognitoProvider.refreshSession not yet implemented (Phase 2 Step 3b).",
    );
  },

  async requestPasswordReset(_email: string): Promise<void> {
    throw new Error(
      "CognitoProvider.requestPasswordReset not yet implemented (Phase 2 Step 3c).",
    );
  },

  async confirmPasswordReset(
    _email: string,
    _code: string,
    _newPassword: string,
  ): Promise<void> {
    throw new Error(
      "CognitoProvider.confirmPasswordReset not yet implemented (Phase 2 Step 3c).",
    );
  },
};
