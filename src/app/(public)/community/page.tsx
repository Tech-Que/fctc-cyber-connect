import { Pin } from "lucide-react";
import { Badge, Card, CardBody, Container } from "@/components/ui";
import {
  getAllCategories,
  getAllThreads,
  getCategoryById,
  getThreadsByCategory,
  getUserById,
} from "@/lib/mock";

const NEW_THREAD_BUTTON =
  "inline-flex items-center justify-center rounded-lg font-medium h-10 px-4 bg-accent text-bg-base hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base";

// Category chips are decorative in Phase 1 — the filter wiring lands in
// Phase 4 alongside the real DB queries. Same for the "New Thread" button,
// which renders disabled until Phase 2 auth and Phase 4 write-path ship.

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function CommunityPage() {
  const threads = [...getAllThreads()].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return (
      new Date(b.lastActivityAt).getTime() -
      new Date(a.lastActivityAt).getTime()
    );
  });

  const categories = getAllCategories();

  return (
    <Container className="py-12 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary">
          Community
        </h1>
        <p className="text-text-muted text-lg">
          Connect with fellow students, alumni, and instructors.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-2 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap">
          <button
            type="button"
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-accent bg-accent/10 text-accent text-sm font-medium"
          >
            All
            <span className="text-text-muted text-xs">({threads.length})</span>
          </button>
          {categories.map((category) => {
            const count = getThreadsByCategory(category.id).length;
            return (
              <button
                key={category.id}
                type="button"
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-text-muted hover:text-text-primary hover:border-text-muted transition-colors text-sm font-medium"
              >
                {category.name}
                <span className="text-xs">({count})</span>
              </button>
            );
          })}
        </div>

        <button type="button" className={NEW_THREAD_BUTTON} disabled>
          New Thread
        </button>
      </div>

      {threads.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-text-muted">
              No threads yet. Be the first to start a discussion.
            </p>
          </CardBody>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3" aria-label="Threads">
          {threads.map((thread) => {
            const author = getUserById(thread.authorId);
            const category = getCategoryById(thread.categoryId);
            return (
              <li key={thread.id}>
                <Card className="hover:bg-bg-subtle transition-colors cursor-pointer">
                  <CardBody className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {thread.pinned && (
                        <Badge variant="warning" className="gap-1">
                          <Pin className="w-3 h-3" aria-hidden />
                          Pinned
                        </Badge>
                      )}
                      {category && (
                        <Badge variant="default">{category.name}</Badge>
                      )}
                      <span className="text-xs text-text-muted">
                        {formatDate(thread.lastActivityAt)}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-text-primary">
                      {thread.title}
                    </h2>
                    <div className="flex items-center justify-between text-sm text-text-muted">
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-bg-subtle text-xs font-semibold text-text-primary border border-border"
                        >
                          {author ? initials(author.displayName) : "?"}
                        </span>
                        <span>{author?.displayName ?? "Unknown"}</span>
                      </div>
                      <span>
                        {thread.replyCount}{" "}
                        {thread.replyCount === 1 ? "reply" : "replies"}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
