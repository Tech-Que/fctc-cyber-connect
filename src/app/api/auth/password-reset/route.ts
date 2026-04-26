import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthProvider } from "@/lib/auth/factory";

// Two-stage flow: request the email (POST), confirm with code (PUT).
// Single route, two HTTP methods.

const requestSchema = z.object({
  email: z.string().email(),
});

const confirmSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const provider = getAuthProvider();
    await provider.requestPasswordReset(parsed.data.email);

    // Deliberately non-revealing message: don't confirm or deny the email
    // is registered. Prevents email-enumeration attacks. Cognito itself
    // returns the same response in both cases.
    return NextResponse.json({
      message:
        "If an account exists for that email, a reset code has been sent.",
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Password reset request failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = confirmSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid confirmation data",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const provider = getAuthProvider();
    await provider.confirmPasswordReset(
      parsed.data.email,
      parsed.data.code,
      parsed.data.newPassword,
    );

    return NextResponse.json({
      message:
        "Password reset successful. You can now sign in with the new password.",
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Password reset confirmation failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
