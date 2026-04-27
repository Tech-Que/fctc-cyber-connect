import { NextRequest, NextResponse } from "next/server";
import { getAuthProvider } from "@/lib/auth/factory";
import {
  readSessionCookies,
  clearSessionCookies,
} from "@/lib/auth/cookies";

export async function POST(req: NextRequest) {
  const { idToken } = readSessionCookies(req.cookies);

  // Best-effort provider-side invalidation. Currently a no-op for Cognito —
  // see roadmap deferred-polish entry on GlobalSignOut. Either way we always
  // clear our cookies so the user is locally signed out.
  if (idToken) {
    try {
      const provider = getAuthProvider();
      await provider.signOut(idToken);
    } catch {
      // Swallow — local signout still succeeds even if the provider call fails.
    }
  }

  const res = NextResponse.json({ message: "Signed out." });
  clearSessionCookies(res);
  return res;
}
