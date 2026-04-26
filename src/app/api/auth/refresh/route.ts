import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthProvider } from "@/lib/auth/factory";

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
  // The existing (possibly-expired) ID token. Required because Cognito's
  // REFRESH_TOKEN_AUTH flow needs SECRET_HASH computed against the user's
  // `sub`, which can't be read from the encrypted refresh token alone.
  // In Step 3d this comes from a cookie alongside the refresh token.
  idToken: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = refreshSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid refresh request",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const provider = getAuthProvider();
    const session = await provider.refreshSession(
      parsed.data.refreshToken,
      parsed.data.idToken,
    );

    return NextResponse.json({
      user: session.user,
      expiresAt: session.expiresAt,
      // TODO(Phase 2 Step 3d): remove once HTTP-only cookies are wired. Same
      // temp pattern as the signin route.
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      message: "Session refreshed.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Refresh failed.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
