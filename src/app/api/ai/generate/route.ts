import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai/factory";
import type { AIMessage } from "@/lib/ai/types";

// Simple in-memory rate limiter — 10 requests per minute per IP.
// Production-grade would use Redis or a dedicated service; this is sufficient
// for Phase 1 (single Node process, low traffic) and matches the HANDOFF §4
// directive that AI requests have rate limits "from day one".
const requestLog = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const MAX_TOTAL_CHARS = 10_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = requestLog.get(ip) ?? [];
  const recent = requests.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    requestLog.set(ip, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. 10 requests per minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const messages = (body as { messages?: unknown }).messages as
    | AIMessage[]
    | undefined;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "messages must be a non-empty array" },
      { status: 400 },
    );
  }

  const totalLength = messages.reduce(
    (sum, m) => sum + (typeof m.content === "string" ? m.content.length : 0),
    0,
  );
  if (totalLength > MAX_TOTAL_CHARS) {
    return NextResponse.json(
      {
        error: `Total message length exceeds ${MAX_TOTAL_CHARS.toLocaleString()} characters`,
      },
      { status: 400 },
    );
  }

  try {
    const provider = getAIProvider();
    const response = await provider.generateResponse(messages);
    return NextResponse.json({ response, provider: provider.name });
  } catch (err) {
    console.error("AI generate error:", err);
    return NextResponse.json(
      { error: "Internal error during generation" },
      { status: 500 },
    );
  }
}
