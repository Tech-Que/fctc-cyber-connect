import { Container } from "@/components/ui";

export default function CommunityPage() {
  return (
    <Container className="py-12">
      <h1 className="text-4xl font-display font-bold mb-4 text-text-primary">
        Community
      </h1>
      <p className="text-text-muted max-w-2xl">
        Message board, threads, and replies land in Phase 4. Read-only view
        for prospective students will appear first.
      </p>
    </Container>
  );
}
