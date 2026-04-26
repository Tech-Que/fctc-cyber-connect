import { NextRequest, NextResponse } from "next/server";
import { getAuthProvider } from "@/lib/auth/factory";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or malformed Authorization header" },
      { status: 401 },
    );
  }

  const token = authHeader.slice(7);
  try {
    const provider = getAuthProvider();
    const user = await provider.getUserFromToken(token);
    return NextResponse.json({ user });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Token verification failed.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
