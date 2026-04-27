import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthProvider } from "@/lib/auth/factory";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 },
      );
    }
    const provider = getAuthProvider();
    await provider.resendVerification(parsed.data.email);
    return NextResponse.json({ message: "Verification code sent." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Resend failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
