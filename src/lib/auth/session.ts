import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./cookies";
import { verifyIdToken } from "./jwt-verifier";
import type { AuthUser, UserRole } from "./types";

/**
 * Read the session cookie and return the current user, or null if not signed in.
 * Use from server components that need session-aware rendering.
 *
 * This duplicates the verification work middleware already did on protected
 * routes — the verifier itself is cheap (jose's JWKS is cached for 10 min;
 * just signature math) so the redundancy is acceptable. If it ever shows up
 * in profiles, we can pass the verified user from middleware to here via a
 * request header.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const store = await cookies();
  const idToken = store.get(SESSION_COOKIE)?.value;
  if (!idToken) return null;

  try {
    const claims = await verifyIdToken(idToken);
    const role = claims["custom:role"];
    if (
      !role ||
      !["prospective", "current", "alumni", "admin"].includes(role)
    ) {
      return null;
    }
    return {
      id: claims.sub,
      email: claims.email,
      role: role as UserRole,
      displayName: claims.name ?? null,
      emailVerified: claims.email_verified,
    };
  } catch {
    // Invalid or expired token — treat as signed out. The cookie clears the
    // next time /api/auth/refresh fails or the user re-signins.
    return null;
  }
}
