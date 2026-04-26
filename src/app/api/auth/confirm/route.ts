import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthProvider } from "@/lib/auth/factory";

const confirmSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(req: NextRequest) {
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
    await provider.confirmSignUp(parsed.data.email, parsed.data.code);

    return NextResponse.json({
      message: "Account confirmed. You can now sign in.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Confirmation failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
