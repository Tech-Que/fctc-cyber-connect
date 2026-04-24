import { Container } from "@/components/ui";

export default function AdminPage() {
  return (
    <Container className="py-12">
      <h1 className="text-4xl font-display font-bold mb-4 text-text-primary">
        Admin
      </h1>
      <p className="text-text-muted max-w-2xl">
        Role-gated moderation and content management tools. Arrives in Phase 6
        (admin role required).
      </p>
    </Container>
  );
}
