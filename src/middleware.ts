import { NextResponse, type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/auth/jwt-verifier";
import { SESSION_COOKIE } from "@/lib/auth/cookies";

/**
 * Edge-runtime route guard.
 *
 * Three guard cases:
 *   1. Unauthenticated user on a protected (app) route → /login?redirect=<path>
 *   2. Authenticated user on a sign-in/sign-up route → /dashboard
 *   3. Authenticated non-admin on /admin → /dashboard?error=admin-only
 *
 * Verification is JWT-only (jose's JWKS verifier, edge-compatible). We do
 * NOT call the Cognito SDK here — the AWS SDK isn't edge-compatible. Cookie
 * trust comes from the signed IdToken; expiry is checked as part of jwtVerify.
 *
 * The matcher at the bottom limits which paths invoke this function. The
 * pathMatches() helper inside is for the secondary classification (which
 * bucket of routes is this).
 */

const APP_ROUTES = ["/dashboard"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/verify",
  "/forgot-password",
  "/reset-password",
];

function pathMatches(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get(SESSION_COOKIE)?.value;

  const isAppRoute = pathMatches(pathname, APP_ROUTES);
  const isAdminRoute = pathMatches(pathname, ADMIN_ROUTES);
  const isAuthRoute = pathMatches(pathname, AUTH_ROUTES);

  if (!isAppRoute && !isAdminRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  let claims: Awaited<ReturnType<typeof verifyIdToken>> | null = null;
  if (sessionCookie) {
    try {
      claims = await verifyIdToken(sessionCookie);
    } catch {
      // Invalid or expired token. Treat as unauthenticated; the cookie will
      // be cleared next time the user hits /api/auth/refresh and that fails,
      // or when they re-signin. Don't redirect-then-clear here — middleware
      // is meant to be cheap and stateless.
      claims = null;
    }
  }

  if (isAuthRoute && claims) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if ((isAppRoute || isAdminRoute) && !claims) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && claims && claims["custom:role"] !== "admin") {
    const dashboardUrl = new URL("/dashboard", req.url);
    dashboardUrl.searchParams.set("error", "admin-only");
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
    "/verify",
    "/forgot-password",
    "/reset-password",
  ],
};
