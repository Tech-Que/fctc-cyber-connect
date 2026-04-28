import Link from "next/link";
import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
} from "@/components/ui";
import {
  getAllResources,
  getAllThreads,
  getPostsByThread,
} from "@/lib/mock";
import { AdminOnlyBanner } from "./AdminOnlyBanner";

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const SUGGESTED_QUESTIONS = [
  "What certifications will I earn?",
  "How long is the program?",
];

export default function DashboardPage() {
  const recentThreads = [...getAllThreads()]
    .sort(
      (a, b) =>
        new Date(b.lastActivityAt).getTime() -
        new Date(a.lastActivityAt).getTime(),
    )
    .slice(0, 3);
  const resources = getAllResources().slice(0, 3);
  const today = DATE_FORMAT.format(new Date());

  return (
    <Container className="py-10 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-bold text-text-primary">
          Welcome back, Marcus
        </h1>
        <p className="text-text-muted">{today}</p>
      </header>

      <AdminOnlyBanner />

      <div className="flex items-start gap-3 bg-bg-subtle border border-border rounded-lg p-3">
        <Badge variant="warning" className="shrink-0">
          Phase 1
        </Badge>
        <p className="text-sm text-text-muted">
          Authentication wires up in Phase 2 — this is a preview of the
          dashboard layout. The greeting, data, and links below are stub.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            {recentThreads.map((t) => {
              const firstPost = getPostsByThread(t.id)[0];
              return (
                <div key={t.id} className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-text-primary line-clamp-1">
                    {t.title}
                  </p>
                  {firstPost ? (
                    <p className="text-xs text-text-muted line-clamp-2">
                      {firstPost.body}
                    </p>
                  ) : (
                    <p className="text-xs text-text-muted">
                      {t.replyCount} replies
                    </p>
                  )}
                </div>
              );
            })}
          </CardBody>
          <CardFooter>
            <Link
              href="/community"
              className="text-sm text-accent hover:underline font-medium"
            >
              View all →
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Resources</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            {resources.map((r) => (
              <div key={r.id} className="flex flex-col gap-1">
                <p className="text-sm font-medium text-text-primary line-clamp-1">
                  {r.title}
                </p>
                <p className="text-xs text-text-muted line-clamp-2">
                  {r.description}
                </p>
              </div>
            ))}
          </CardBody>
          <CardFooter>
            <Link
              href="/resources"
              className="text-sm text-accent hover:underline font-medium"
            >
              Browse all →
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ask the Assistant</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            <p className="text-xs text-text-muted uppercase tracking-wide">
              Try one of these
            </p>
            {SUGGESTED_QUESTIONS.map((q) => (
              <p key={q} className="text-sm text-text-primary">
                &ldquo;{q}&rdquo;
              </p>
            ))}
          </CardBody>
          <CardFooter>
            <Link
              href="/assistant"
              className="text-sm text-accent hover:underline font-medium"
            >
              Open assistant →
            </Link>
          </CardFooter>
        </Card>
      </div>

      <section className="bg-bg-subtle border border-border rounded-lg p-6">
        <h2 className="font-display text-lg font-semibold text-text-primary mb-2">
          More dashboard features coming in Phase 2+
        </h2>
        <ul className="text-sm text-text-muted flex flex-col gap-1 list-disc list-inside">
          <li>Saved threads</li>
          <li>Personal progress tracker</li>
          <li>Certification study plan</li>
        </ul>
      </section>
    </Container>
  );
}
