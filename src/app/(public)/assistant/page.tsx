"use client";

// Calls /api/ai/generate, which runs through the AIProvider factory.
// Provider is selected by AI_PROVIDER env var (defaults to "mock").

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button, Container, Input } from "@/components/ui";
import type { AIMessage } from "@/lib/ai/types";
import { cn } from "@/lib/utils/cn";

const SUGGESTIONS = [
  "What certifications will I earn?",
  "How long is the program?",
  "Is financial aid available?",
  "What are the prerequisites?",
];

const WELCOME: AIMessage = {
  role: "assistant",
  content:
    "Hi — I'm the FCTC Cyber Connect assistant. Ask me about the program, certifications, prerequisites, or career outcomes. (Phase 1 mock — real AI responses arrive in Phase 5.)",
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<AIMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMessage: AIMessage = { role: "user", content: trimmed };
    const next = [...messages, userMessage];
    setMessages(next);
    setInput("");
    setLoading(true);

    let replyContent: string;
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (res.status === 429) {
        replyContent =
          "You're sending messages too quickly — wait a minute and try again.";
      } else if (res.status === 400) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        replyContent = data.error ?? "Bad request.";
      } else if (!res.ok) {
        replyContent = "Something went wrong. Please try again.";
      } else {
        const data = (await res.json()) as { response?: string };
        replyContent =
          data.response ?? "Something went wrong. Please try again.";
      }
    } catch {
      replyContent = "Network error. Please check your connection.";
    }

    setMessages([...next, { role: "assistant", content: replyContent }]);
    setLoading(false);
  }

  return (
    <Container size="sm" className="py-10 flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-bold text-text-primary">
          AI Assistant
        </h1>
        <p className="text-text-muted">
          Get answers about the cybersecurity program.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((q) => (
          <Button
            key={q}
            variant="ghost"
            size="sm"
            onClick={() => send(q)}
            disabled={loading}
            className="border border-border"
          >
            {q}
          </Button>
        ))}
      </div>

      <div
        ref={listRef}
        className="min-h-[400px] max-h-[600px] overflow-y-auto rounded-lg border border-border bg-bg-card p-4 flex flex-col gap-3"
        aria-live="polite"
        aria-busy={loading}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] px-4 py-2 rounded-lg",
              m.role === "user"
                ? "self-end bg-accent text-bg-base"
                : "self-start bg-bg-subtle text-text-primary",
            )}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="self-start bg-bg-subtle text-text-muted px-4 py-2 rounded-lg italic">
            Thinking…
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2 items-start"
      >
        <div className="flex-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the program…"
            disabled={loading}
            aria-label="Message"
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message"
          className="w-10 px-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Container>
  );
}
