import type { NextResponse } from "next/server";

/**
 * HTTP-only cookie session storage.
 *
 * Two cookies, both HttpOnly + SameSite=Lax + Path=/:
 *   - fctc-session: the IdToken (carries custom:role; treated as our session token)
 *   - fctc-refresh: the RefreshToken (used by /api/auth/refresh to mint a new IdToken)
 *
 * Why two cookies and not one combined blob: keeping them separate means the
 * refresh route can rotate the session cookie without touching the refresh
 * cookie (Cognito doesn't rotate refresh tokens), and signout can clear them
 * symmetrically. Splitting also makes Max-Age semantics simpler — the session
 * cookie's Max-Age tracks IdToken expiry, the refresh cookie's tracks the
 * (longer) refresh token validity window.
 *
 * AccessToken is intentionally NOT stored. We use IdToken as our session token
 * because it carries custom:role; AccessToken would just be dead weight here.
 * If we ever need GlobalSignOut, we'll add a third cookie (see roadmap).
 */

export const SESSION_COOKIE = "fctc-session";
export const REFRESH_COOKIE = "fctc-refresh";

// 30 days in seconds — matches Cognito's default refresh token validity.
// IdToken's own ExpiresIn is much shorter (1 hour by default); the session
// cookie inherits its lifetime from the refresh cookie because we'll mint a
// fresh IdToken on every refresh, and the cookie just rides along.
const REFRESH_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

interface SessionCookieOptions {
  idToken: string;
  refreshToken: string;
}

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export function setSessionCookies(
  res: NextResponse,
  { idToken, refreshToken }: SessionCookieOptions,
): void {
  const opts = baseCookieOptions();
  res.cookies.set(SESSION_COOKIE, idToken, {
    ...opts,
    maxAge: REFRESH_MAX_AGE_SECONDS,
  });
  res.cookies.set(REFRESH_COOKIE, refreshToken, {
    ...opts,
    maxAge: REFRESH_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookies(res: NextResponse): void {
  const opts = baseCookieOptions();
  // maxAge: 0 expires the cookie immediately. Setting empty value isn't
  // enough on its own — without an expiration the browser keeps it.
  res.cookies.set(SESSION_COOKIE, "", { ...opts, maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { ...opts, maxAge: 0 });
}

export interface SessionCookies {
  idToken: string | undefined;
  refreshToken: string | undefined;
}

export function readSessionCookies(cookies: {
  get: (name: string) => { value: string } | undefined;
}): SessionCookies {
  return {
    idToken: cookies.get(SESSION_COOKIE)?.value,
    refreshToken: cookies.get(REFRESH_COOKIE)?.value,
  };
}
