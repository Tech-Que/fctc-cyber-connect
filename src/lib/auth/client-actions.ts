import { apiPost } from "@/lib/api/client";

/**
 * Client-side signout.
 *
 * Calls /api/auth/signout (which clears the HTTP-only session cookies) and
 * then forces a hard navigation. We use window.location.href instead of
 * router.push so any cached server-component data tied to the previous
 * session gets discarded — router.push would keep the React tree warm.
 *
 * Even if the API call fails, we still navigate; the cookies are best-effort
 * cleared by the server, but the user clicked "sign out" and we shouldn't
 * leave them stranded on a logged-in-looking page.
 */
export async function signOut(redirectTo: string = "/"): Promise<void> {
  try {
    await apiPost("/api/auth/signout");
  } catch {
    // Swallow — fall through to the redirect.
  }
  window.location.href = redirectTo;
}
