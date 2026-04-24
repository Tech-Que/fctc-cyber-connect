import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Container,
} from "@/components/ui";

const PANELS = [
  {
    title: "Moderation Queue",
    body: "Reports from users appear here. Soft-deleted content can be reviewed and restored.",
  },
  {
    title: "User Management",
    body: "View user roles, promote to admin, suspend accounts. Every action audit-logged.",
  },
  {
    title: "FAQs",
    body: "Edit the published FAQ list shown on /program.",
  },
  {
    title: "Audit Log",
    body: "Every moderation action with actor, target, timestamp, and reason.",
  },
];

export default function AdminPage() {
  return (
    <Container className="py-10 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-bold text-text-primary">
          Admin
        </h1>
        <p className="text-text-muted">
          Moderation queue, user management, and content tools.
        </p>
      </header>

      <div className="flex items-start gap-3 bg-danger/10 border border-danger/30 rounded-lg p-3">
        <Badge variant="danger" className="shrink-0">
          Restricted
        </Badge>
        <p className="text-sm text-text-muted">
          Role-gated access. Enforced in Phase 2. Full moderation tooling lands
          in Phase 6.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PANELS.map((panel) => (
          <Card key={panel.title}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{panel.title}</CardTitle>
                <Badge variant="default" className="shrink-0">
                  Phase 6
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-text-muted">{panel.body}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </Container>
  );
}
