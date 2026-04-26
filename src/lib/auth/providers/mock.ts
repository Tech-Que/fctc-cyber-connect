import type {
  AuthProvider,
  AuthSession,
  AuthUser,
  SignInInput,
  SignUpInput,
} from "../types";

/**
 * Mock auth provider for local development and testing.
 * Accepts any email/password; returns deterministic session data.
 * NEVER use AUTH_PROVIDER=mock in production — there is no actual security here.
 */

const MOCK_USERS: Record<string, AuthUser> = {
  "student@example.com": {
    id: "mock-user-current-001",
    email: "student@example.com",
    role: "current",
    displayName: "Test Student",
    emailVerified: true,
  },
  "admin@example.com": {
    id: "mock-user-admin-001",
    email: "admin@example.com",
    role: "admin",
    displayName: "Test Admin",
    emailVerified: true,
  },
};

function makeSession(user: AuthUser): AuthSession {
  const now = Math.floor(Date.now() / 1000);
  return {
    user,
    accessToken: `mock-access-${user.id}`,
    refreshToken: `mock-refresh-${user.id}`,
    expiresAt: now + 3600,
  };
}

export const mockAuthProvider: AuthProvider = {
  name: "mock",

  async signUp(input: SignUpInput) {
    return { userId: `mock-${input.email}`, needsVerification: false };
  },

  async confirmSignUp() {
    // no-op
  },

  async resendVerification() {
    // no-op
  },

  async signIn(input: SignInInput): Promise<AuthSession> {
    const user = MOCK_USERS[input.email];
    if (!user) {
      throw new Error(
        "Mock auth: unknown user. Use student@example.com or admin@example.com.",
      );
    }
    return makeSession(user);
  },

  async signOut() {
    // no-op
  },

  async getUserFromToken(accessToken: string): Promise<AuthUser> {
    const userId = accessToken.replace("mock-access-", "");
    const user = Object.values(MOCK_USERS).find((u) => u.id === userId);
    if (!user) throw new Error("Mock auth: invalid token.");
    return user;
  },

  async refreshSession(refreshToken: string): Promise<AuthSession> {
    const userId = refreshToken.replace("mock-refresh-", "");
    const user = Object.values(MOCK_USERS).find((u) => u.id === userId);
    if (!user) throw new Error("Mock auth: invalid refresh token.");
    return makeSession(user);
  },

  async requestPasswordReset() {
    // no-op
  },

  async confirmPasswordReset() {
    // no-op
  },
};
