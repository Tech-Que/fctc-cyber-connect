import { NextRequest, NextResponse } from "next/server";
import { getAuthProvider } from "@/lib/auth/factory";
import { readSessionCookies } from "@/lib/auth/cookies";

export async function GET(req: NextRequest) {
  const { idToken } = readSessionCookies(req.cookies);
  if (!idToken) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const provider = getAuthProvider();
    const user = await provider.getUserFromToken(idToken);
    return NextResponse.json({ user });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Token verification failed.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
