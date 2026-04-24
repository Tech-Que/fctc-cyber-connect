import { Container } from "@/components/ui";

export default function DashboardPage() {
  return (
    <Container className="py-12">
      <h1 className="text-4xl font-display font-bold mb-4 text-text-primary">
        Dashboard
      </h1>
      <p className="text-text-muted max-w-2xl">
        Authenticated user dashboard. Real content and auth gating land in
        Phase 2.
      </p>
    </Container>
  );
}
