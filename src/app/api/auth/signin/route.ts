import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthProvider } from "@/lib/auth/factory";
import { setSessionCookies } from "@/lib/auth/cookies";

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

    const res = NextResponse.json({
      user: session.user,
      expiresAt: session.expiresAt,
      message: "Signed in successfully.",
    });
    setSessionCookies(res, {
      idToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sign-in failed.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
