import type {
  AuthProvider,
  AuthSession,
  AuthUser,
  SignInInput,
  SignUpInput,
} from "../types";

/**
 * Cognito implementation of AuthProvider.
 * Implementation lands in Phase 2 Step 3.
 */
export const cognitoProvider: AuthProvider = {
  name: "cognito",

  async signUp(
    _input: SignUpInput,
  ): Promise<{ userId: string; needsVerification: boolean }> {
    throw new Error(
      "CognitoProvider.signUp not yet implemented (Phase 2 Step 3).",
    );
  },

  async confirmSignUp(_email: string, _code: string): Promise<void> {
    throw new Error(
      "CognitoProvider.confirmSignUp not yet implemented (Phase 2 Step 3).",
    );
  },

  async resendVerification(_email: string): Promise<void> {
    throw new Error(
      "CognitoProvider.resendVerification not yet implemented (Phase 2 Step 3).",
    );
  },

  async signIn(_input: SignInInput): Promise<AuthSession> {
    throw new Error(
      "CognitoProvider.signIn not yet implemented (Phase 2 Step 3).",
    );
  },

  async signOut(_accessToken: string): Promise<void> {
    throw new Error(
      "CognitoProvider.signOut not yet implemented (Phase 2 Step 3).",
    );
  },

  async getUserFromToken(_accessToken: string): Promise<AuthUser> {
    throw new Error(
      "CognitoProvider.getUserFromToken not yet implemented (Phase 2 Step 3).",
    );
  },

  async refreshSession(_refreshToken: string): Promise<AuthSession> {
    throw new Error(
      "CognitoProvider.refreshSession not yet implemented (Phase 2 Step 3).",
    );
  },

  async requestPasswordReset(_email: string): Promise<void> {
    throw new Error(
      "CognitoProvider.requestPasswordReset not yet implemented (Phase 2 Step 3).",
    );
  },

  async confirmPasswordReset(
    _email: string,
    _code: string,
    _newPassword: string,
  ): Promise<void> {
    throw new Error(
      "CognitoProvider.confirmPasswordReset not yet implemented (Phase 2 Step 3).",
    );
  },
};
