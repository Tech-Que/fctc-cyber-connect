import {
  Award,
  GraduationCap,
  Rocket,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardBody, Container } from "@/components/ui";
import { getResourcesByCategory } from "@/lib/mock";
import type { Resource } from "@/types";

const SECTIONS: Array<{
  key: Resource["category"];
  label: string;
  description: string;
  Icon: LucideIcon;
}> = [
  {
    key: "certification",
    label: "Certifications",
    description: "Official exam pages and prep resources.",
    Icon: Award,
  },
  {
    key: "study",
    label: "Practice & Study",
    description: "Labs, wargames, and reference material.",
    Icon: GraduationCap,
  },
  {
    key: "career",
    label: "Career",
    description: "Job market maps and workforce frameworks.",
    Icon: Rocket,
  },
  {
    key: "fctc",
    label: "FCTC",
    description: "First Coast Technical College resources.",
    Icon: Sparkles,
  },
];

export default function ResourcesPage() {
  return (
    <Container className="py-12 flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary">
          Resources
        </h1>
        <p className="text-text-muted text-lg">
          Curated external links — certifications, hands-on practice, and
          career references.
        </p>
      </header>

      {SECTIONS.map(({ key, label, description, Icon }) => {
        const items = getResourcesByCategory(key);
        if (items.length === 0) return null;
        return (
          <section key={key} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-accent" aria-hidden />
              <div className="flex flex-col">
                <h2 className="font-display text-2xl font-semibold text-text-primary">
                  {label}
                </h2>
                <p className="text-sm text-text-muted">{description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
                >
                  <Card className="h-full group-hover:border-accent transition-colors">
                    <CardBody className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                          {resource.title}
                        </h3>
                        <ExternalLink
                          className="w-4 h-4 text-text-muted shrink-0 mt-0.5"
                          aria-hidden
                        />
                      </div>
                      <p className="text-sm text-text-muted">
                        {resource.description}
                      </p>
                    </CardBody>
                  </Card>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </Container>
  );
}
