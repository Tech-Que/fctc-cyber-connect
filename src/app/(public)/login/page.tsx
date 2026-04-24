import { Container } from "@/components/ui";

export default function LoginPage() {
  return (
    <Container className="py-12">
      <h1 className="text-4xl font-display font-bold mb-4 text-text-primary">
        Sign In
      </h1>
      <p className="text-text-muted max-w-2xl">
        Authentication form lands in Phase 2 (AWS Cognito + AuthProvider
        abstraction).
      </p>
    </Container>
  );
}
