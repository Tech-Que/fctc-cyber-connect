// Partial seed of the AIProvider abstraction described in HANDOFF §9.
// Step 9 formalizes the full AIProvider interface + factory + provider selection.

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
