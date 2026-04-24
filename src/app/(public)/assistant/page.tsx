import { Container } from "@/components/ui";

export default function AssistantPage() {
  return (
    <Container className="py-12">
      <h1 className="text-4xl font-display font-bold mb-4 text-text-primary">
        AI Assistant
      </h1>
      <p className="text-text-muted max-w-2xl">
        Chat interface shell arrives in Phase 1, Step 8 (mock provider). Real
        LLM providers (Ollama, OpenAI, Bedrock) land in Phase 5.
      </p>
    </Container>
  );
}
