import { Container } from "@/components/ui";

export default function OfflinePage() {
  return (
    <Container className="py-20 text-center">
      <h1 className="text-3xl font-display font-bold mb-4 text-text-primary">
        You&apos;re offline
      </h1>
      <p className="text-text-muted max-w-md mx-auto">
        FCTC Cyber Connect needs an internet connection to load fresh content.
        Reconnect and try again.
      </p>
    </Container>
  );
}
