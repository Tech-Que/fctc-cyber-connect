// AIProvider abstraction per HANDOFF §9.
// Step 9 formalizes the full interface; mock implements it now,
// ollama/openai/bedrock stubs throw until Phase 5+.

export type AIRole = "user" | "assistant" | "system";

export interface AIMessage {
  role: AIRole;
  content: string;
}

export interface AIProvider {
  name: string;
  generateResponse(
    messages: AIMessage[],
    context?: Record<string, unknown>,
  ): Promise<string>;
}

export type AIProviderName = "mock" | "ollama" | "openai" | "bedrock";
