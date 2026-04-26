import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthProvider } from "@/lib/auth/factory";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(80),
  role: z.enum(["prospective", "current", "alumni"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid signup data",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const provider = getAuthProvider();
    const result = await provider.signUp(parsed.data);

    return NextResponse.json({
      userId: result.userId,
      needsVerification: result.needsVerification,
      message: result.needsVerification
        ? "Check your email for a verification code."
        : "Account created successfully.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signup failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
