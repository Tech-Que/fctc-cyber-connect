import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthProvider } from "@/lib/auth/factory";

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signinSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid signin data",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const provider = getAuthProvider();
    const session = await provider.signIn(parsed.data);

    return NextResponse.json({
      user: session.user,
      expiresAt: session.expiresAt,
      // TODO(Phase 2 Step 3d): remove these two fields once HTTP-only cookie
      // session is wired. Exposing tokens in the JSON body is a temporary
      // affordance for live testing of /api/auth/me and /api/auth/refresh;
      // production-shaped sessions never hand the raw tokens to JS.
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      message:
        "Signed in successfully. Note: token-based session not yet wired (Step 3d).",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sign-in failed.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
