// BedrockProvider — uses the AWS Bedrock SDK.
// Implementation deferred to Phase 5+ per HANDOFF §9 sequencing.

import type { AIMessage, AIProvider } from "../types";

export const bedrockProvider: AIProvider = {
  name: "bedrock",
  async generateResponse(_messages: AIMessage[]): Promise<string> {
    throw new Error(
      "BedrockProvider not yet implemented. Lands in Phase 5+. Set AI_PROVIDER=mock for now.",
    );
  },
};
