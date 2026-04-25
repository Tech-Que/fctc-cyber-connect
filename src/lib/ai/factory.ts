// AIProvider factory. Reads AI_PROVIDER env var (defaults to "mock") and
// returns the configured provider. Unknown values throw at startup, satisfying
// HANDOFF §10 ("missing/invalid env should fail loudly, not silently").

import type { AIProvider, AIProviderName } from "./types";
import { mockProvider } from "./providers/mock";
import { ollamaProvider } from "./providers/ollama";
import { openaiProvider } from "./providers/openai";
import { bedrockProvider } from "./providers/bedrock";

const providers: Record<AIProviderName, AIProvider> = {
  mock: mockProvider,
  ollama: ollamaProvider,
  openai: openaiProvider,
  bedrock: bedrockProvider,
};

export function getAIProvider(): AIProvider {
  const name = (process.env.AI_PROVIDER ?? "mock") as AIProviderName;
  const provider = providers[name];
  if (!provider) {
    throw new Error(
      `Unknown AI_PROVIDER: ${name}. Valid: mock, ollama, openai, bedrock.`,
    );
  }
  return provider;
}
