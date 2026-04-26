/**
 * Auth provider abstraction.
 *
 * Same shape as AIProvider — concrete implementations swap via env config,
 * components/routes only know the interface.
 */

export type UserRole = "prospective" | "current" | "alumni" | "admin";

export interface AuthUser {
  id: string; // provider's user identifier (Cognito sub claim)
  email: string;
  role: UserRole;
  displayName: string | null;
  emailVerified: boolean;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // unix timestamp in seconds
}

export interface SignUpInput {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthProvider {
  name: string;

  /**
   * Create a new account. Returns immediately on success; the provider
   * may require email verification before the user can actually sign in.
   */
  signUp(
    input: SignUpInput,
  ): Promise<{ userId: string; needsVerification: boolean }>;

  /**
   * Confirm an account using a verification code from the signup email.
   */
  confirmSignUp(email: string, code: string): Promise<void>;

  /**
   * Resend the verification email.
   */
  resendVerification(email: string): Promise<void>;

  /**
   * Authenticate an existing user. Returns a full session on success.
   */
  signIn(input: SignInInput): Promise<AuthSession>;

  /**
   * Invalidate the current session at the provider.
   * Local cookie clearing happens at the route handler level.
   */
  signOut(accessToken: string): Promise<void>;

  /**
   * Validate an access token and return the associated user.
   * Used by middleware on every protected request.
   */
  getUserFromToken(accessToken: string): Promise<AuthUser>;

  /**
   * Exchange a refresh token for a new access token.
   */
  refreshSession(refreshToken: string): Promise<AuthSession>;

  /**
   * Initiate password reset (sends email with reset code).
   */
  requestPasswordReset(email: string): Promise<void>;

  /**
   * Complete password reset with the code from the email.
   */
  confirmPasswordReset(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void>;
}

export type AuthProviderName = "cognito" | "mock";
