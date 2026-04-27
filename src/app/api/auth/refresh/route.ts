import { NextRequest, NextResponse } from "next/server";
import { getAuthProvider } from "@/lib/auth/factory";
import {
  readSessionCookies,
  setSessionCookies,
  clearSessionCookies,
} from "@/lib/auth/cookies";

export async function POST(req: NextRequest) {
  const { idToken, refreshToken } = readSessionCookies(req.cookies);
  if (!idToken || !refreshToken) {
    return NextResponse.json(
      { error: "No session cookies present." },
      { status: 401 },
    );
  }

  try {
    const provider = getAuthProvider();
    const session = await provider.refreshSession(refreshToken, idToken);

    const res = NextResponse.json({
      user: session.user,
      expiresAt: session.expiresAt,
      message: "Session refreshed.",
    });
    setSessionCookies(res, {
      idToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
    return res;
  } catch (err) {
    // Refresh failed — assume the refresh token is dead and clear cookies so
    // the client is forced through a full re-signin rather than retrying with
    // a stale token forever.
    const message = err instanceof Error ? err.message : "Refresh failed.";
    const res = NextResponse.json({ error: message }, { status: 401 });
    clearSessionCookies(res);
    return res;
  }
}
