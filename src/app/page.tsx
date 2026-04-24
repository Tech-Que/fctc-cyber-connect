import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  Input,
} from "@/components/ui";

export default function Home() {
  return (
    <Container className="py-10 flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-wide text-text-primary">
          FCTC CYBER CONNECT
        </h1>
        <p className="text-text-muted">
          Step 4 UI primitive showcase. All colors via semantic tokens — the
          same markup flips between light and dark themes.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Buttons
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {(["primary", "secondary", "ghost"] as const).map((variant) => (
            <div key={variant} className="flex flex-col gap-3 items-start">
              <span className="text-xs uppercase tracking-wide text-text-muted">
                {variant}
              </span>
              <Button variant={variant} size="sm">
                Small
              </Button>
              <Button variant={variant} size="md">
                Medium
              </Button>
              <Button variant={variant} size="lg">
                Large
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Card
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Introduction to Cybersecurity</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-text-muted">
              A foundational course covering the core principles of information
              security, common threat models, and hands-on lab exercises with
              industry-standard tools.
            </p>
          </CardBody>
          <CardFooter>
            <Button variant="primary" size="sm">
              Enroll
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Inputs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Input
            label="Username"
            placeholder="quenton"
            hint="3–20 characters, letters and numbers only"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error="Password must be at least 8 characters"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Badges
        </h2>
        <div className="flex flex-wrap gap-2">
          <Badge>default</Badge>
          <Badge variant="primary">primary</Badge>
          <Badge variant="success">success</Badge>
          <Badge variant="warning">warning</Badge>
          <Badge variant="danger">danger</Badge>
        </div>
      </section>
    </Container>
  );
}
