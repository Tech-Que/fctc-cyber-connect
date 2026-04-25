// OllamaProvider — local LLM via http://localhost:11434/api/generate.
// Implementation deferred to Phase 5 per HANDOFF §9 sequencing.

import type { AIMessage, AIProvider } from "../types";

export const ollamaProvider: AIProvider = {
  name: "ollama",
  async generateResponse(_messages: AIMessage[]): Promise<string> {
    throw new Error(
      "OllamaProvider not yet implemented. Lands in Phase 5. Set AI_PROVIDER=mock for now.",
    );
  },
};
