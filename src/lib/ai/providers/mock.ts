// Phase 1 — stubs MockAIProvider. Step 9 formalizes the full AIProvider interface.

import type { AIMessage } from "../types";

const CANNED_RESPONSES: Array<{ match: RegExp; response: string }> = [
  {
    match: /\b(cert|certification|security\+|network\+|cysa|comptia)/i,
    response:
      "The FCTC program prepares you for CompTIA Security+, Network+, and CySA+. Some students also pursue PenTest+ or a cloud certification. Exam vouchers are often covered by financial aid; the first attempt is the one most students get funded.",
  },
  {
    match: /\b(how long|duration|length|months?|semester)\b/i,
    response:
      "The program runs approximately 18 months full-time. Part-time options extend that timeline. Structure: core foundations → specialized tracks → a capstone project that demonstrates end-to-end skills.",
  },
  {
    match: /\b(financial aid|tuition|cost|pay|afford|fafsa|scholarship)/i,
    response:
      "Yes — FCTC participates in federal financial aid, offers scholarships specific to technical education, and can connect qualifying students with workforce development grants. Start with FAFSA and book a one-on-one with the financial aid office for your specific situation.",
  },
  {
    match: /\b(prerequisite|requirement|prior experience|background)/i,
    response:
      "A high school diploma or equivalent, placement into college-level math, and basic computer literacy. No prior programming or networking background needed — the first modules cover fundamentals from the ground up.",
  },
  {
    match: /\b(job|career|placement|employ|hire|internship)/i,
    response:
      "Most graduates place into cybersecurity or adjacent IT roles within six months. Regional employers — hospitals, financial institutions, and government contractors — actively recruit from FCTC. Career services supports resume review, interview prep, and employer introductions.",
  },
];

const DEFAULT_RESPONSE =
  "I'm a placeholder AI assistant. Real responses arrive in Phase 5 when the AI provider abstraction integrates with Ollama, OpenAI, or AWS Bedrock. Try asking about certifications, program duration, financial aid, prerequisites, or job placement.";

export async function generateMockResponse(
  messages: AIMessage[],
): Promise<string> {
  // Simulate a small amount of network latency so the UI can show a
  // "thinking" state and the mock experience feels more like the real thing.
  await new Promise((resolve) => setTimeout(resolve, 500));

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return DEFAULT_RESPONSE;

  for (const { match, response } of CANNED_RESPONSES) {
    if (match.test(lastUser.content)) return response;
  }
  return DEFAULT_RESPONSE;
}
