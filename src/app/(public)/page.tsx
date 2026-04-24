import Link from "next/link";
import { ShieldCheck, Award, Rocket } from "lucide-react";
import {
  Card,
  CardBody,
  Container,
} from "@/components/ui";
import {
  getAllThreads,
  getCategoryById,
  getUserById,
} from "@/lib/mock";

const FEATURES = [
  {
    Icon: ShieldCheck,
    title: "Hands-on Labs",
    body: "Practice in realistic virtualized environments. Build muscle memory for incident response, forensics, and vulnerability assessment.",
  },
  {
    Icon: Award,
    title: "Industry Certifications",
    body: "Prepare for CompTIA Security+, Network+, and CySA+ — the credentials employers ask for first. Exam vouchers often covered by financial aid.",
  },
  {
    Icon: Rocket,
    title: "Career Pathways",
    body: "Connect with alumni placed in SOC, audit, and cloud security roles. Career services supports resume review, interviews, and employer introductions.",
  },
];

// Hero and closing CTA render a fixed dark gradient regardless of theme — the
// one intentional override from our semantic-token rule. brand-* literals are
// acceptable here because the surface is deliberately theme-agnostic.
const HERO_PRIMARY =
  "inline-flex items-center justify-center rounded-lg font-medium h-12 px-6 text-base bg-accent text-brand-navy hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy";
const HERO_SECONDARY =
  "inline-flex items-center justify-center rounded-lg font-medium h-12 px-6 text-base border-2 border-brand-white/30 text-brand-white hover:bg-brand-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy";

export default function HomePage() {
  const recentThreads = [...getAllThreads()]
    .sort(
      (a, b) =>
        new Date(b.lastActivityAt).getTime() -
        new Date(a.lastActivityAt).getTime(),
    )
    .slice(0, 4);

  return (
    <>
      <section className="bg-gradient-to-br from-brand-navy to-[#1a2f5c] py-20 md:py-32">
        <Container className="flex flex-col items-center text-center gap-6">
          <span className="text-highlight font-mono text-sm uppercase tracking-wider">
            First Coast Technical College
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-brand-white leading-tight max-w-4xl">
            Launch Your Cybersecurity Career
          </h1>
          <p className="text-brand-gray text-lg md:text-xl max-w-2xl">
            Connect with classmates, access industry certifications, and build
            the skills employers want — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/program" className={HERO_PRIMARY}>
              Explore the Program
            </Link>
            <Link href="/signup" className={HERO_SECONDARY}>
              Join the Community
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(({ Icon, title, body }) => (
            <Card key={title}>
              <CardBody className="flex flex-col gap-3">
                <Icon className="w-8 h-8 text-accent" />
                <h3 className="font-display text-xl font-semibold text-text-primary">
                  {title}
                </h3>
                <p className="text-text-muted">{body}</p>
              </CardBody>
            </Card>
          ))}
        </Container>
      </section>

      <section className="bg-bg-subtle border-y border-border py-16">
        <Container className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-text-primary">
              Join the Conversation
            </h2>
            <p className="text-text-muted">
              Recent threads from current students and alumni.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentThreads.map((thread) => {
              const author = getUserById(thread.authorId);
              const category = getCategoryById(thread.categoryId);
              return (
                <Link
                  key={thread.id}
                  href="/community"
                  className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Card className="h-full group-hover:border-accent transition-colors">
                    <CardBody className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>{category?.name ?? ""}</span>
                        <span>
                          {thread.replyCount}{" "}
                          {thread.replyCount === 1 ? "reply" : "replies"}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {thread.title}
                      </h3>
                      <p className="text-sm text-text-muted">
                        by {author?.displayName ?? "Unknown"}
                      </p>
                    </CardBody>
                  </Card>
                </Link>
              );
            })}
          </div>
          <Link
            href="/community"
            className="text-accent hover:underline font-medium self-start"
          >
            View All Discussions →
          </Link>
        </Container>
      </section>

      <section className="py-16">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            Ready to Get Started?
          </h2>
          <p className="text-text-muted max-w-xl">
            Create an account to post, reply, and get matched with mentors.
          </p>
          <Link href="/signup" className={HERO_PRIMARY}>
            Create Your Account
          </Link>
        </Container>
      </section>
    </>
  );
}
