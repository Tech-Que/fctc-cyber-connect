// AIProvider factory. Returns the provider configured by AI_PROVIDER (validated
// in `lib/env`). Unknown values can't reach here — the env validator rejects
// them at startup per HANDOFF §10 ("missing/invalid env should fail loudly,
// not silently").

import type { AIProvider, AIProviderName } from "./types";
import { mockProvider } from "./providers/mock";
import { ollamaProvider } from "./providers/ollama";
import { openaiProvider } from "./providers/openai";
import { bedrockProvider } from "./providers/bedrock";
import { env } from "@/lib/env";

const providers: Record<AIProviderName, AIProvider> = {
  mock: mockProvider,
  ollama: ollamaProvider,
  openai: openaiProvider,
  bedrock: bedrockProvider,
};

export function getAIProvider(): AIProvider {
  return providers[env.AI_PROVIDER];
}
