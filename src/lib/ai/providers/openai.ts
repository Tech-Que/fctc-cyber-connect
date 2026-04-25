// OpenAIProvider — uses the OpenAI SDK against api.openai.com.
// Implementation deferred to Phase 5+ per HANDOFF §9 sequencing.

import type { AIMessage, AIProvider } from "../types";

export const openaiProvider: AIProvider = {
  name: "openai",
  async generateResponse(_messages: AIMessage[]): Promise<string> {
    throw new Error(
      "OpenAIProvider not yet implemented. Lands in Phase 5+. Set AI_PROVIDER=mock for now.",
    );
  },
};
