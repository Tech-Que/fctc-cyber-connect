import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  MessageCircle,
  FileCheck,
  Cloud,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { Badge, Card, CardBody, Container } from "@/components/ui";
import { getPublishedFaqs } from "@/lib/mock";

const TOPICS = [
  {
    Icon: ShieldCheck,
    title: "Network Defense",
    body: "Firewalls, segmentation, and monitoring for enterprise networks.",
  },
  {
    Icon: ShieldAlert,
    title: "Ethical Hacking",
    body: "Recon, scanning, exploitation, and responsible disclosure.",
  },
  {
    Icon: MessageCircle,
    title: "Incident Response",
    body: "Detection, containment, eradication, recovery, and post-incident review.",
  },
  {
    Icon: FileCheck,
    title: "Risk Management",
    body: "Asset classification, threat modeling, and control prioritization.",
  },
  {
    Icon: Cloud,
    title: "Cloud Security",
    body: "Identity, configuration, and data protection across AWS and Azure.",
  },
  {
    Icon: GraduationCap,
    title: "Compliance & GRC",
    body: "Frameworks (NIST, ISO 27001), audits, and policy writing.",
  },
];

const CERTS = [
  "Security+",
  "Network+",
  "CySA+",
  "PenTest+",
  "AWS Cloud Practitioner",
  "SSCP",
];

const CTA_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium h-12 px-6 text-base bg-accent text-bg-base hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base";

export default function ProgramPage() {
  const faqs = getPublishedFaqs();

  return (
    <Container className="py-12 flex flex-col gap-14">
      <header className="flex flex-col gap-3 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary">
          Cybersecurity Program
        </h1>
        <p className="text-text-muted text-lg">
          An 18-month technical program that turns curiosity into employable
          skill. Hands-on labs, industry certifications, and a capstone project
          that demonstrates end-to-end capability.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-2xl font-semibold text-text-primary">
          What You&apos;ll Learn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map(({ Icon, title, body }) => (
            <Card key={title}>
              <CardBody className="flex flex-col gap-2">
                <Icon className="w-6 h-6 text-accent" />
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  {title}
                </h3>
                <p className="text-sm text-text-muted">{body}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold text-text-primary">
          Certifications Covered
        </h2>
        <p className="text-text-muted">
          Graduates leave prepared to sit for these exams. Exam vouchers are
          often covered by financial aid for the first attempt.
        </p>
        <div className="flex flex-wrap gap-2">
          {CERTS.map((cert) => (
            <Badge key={cert} variant="primary">
              {cert}
            </Badge>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold text-text-primary">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group bg-bg-card border border-border rounded-lg"
            >
              <summary className="cursor-pointer p-4 font-medium text-text-primary flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span
                  aria-hidden
                  className="text-text-muted group-open:rotate-180 transition-transform"
                >
                  ▾
                </span>
              </summary>
              <div className="px-4 pb-4 text-text-muted">{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 text-center border-t border-border pt-12">
        <h2 className="font-display text-2xl font-semibold text-text-primary">
          Ready to enroll?
        </h2>
        <p className="text-text-muted max-w-xl">
          Talk to FCTC Admissions about start dates, prerequisites, and
          financial aid.
        </p>
        <Link
          href="https://www.fctc.edu"
          target="_blank"
          rel="noopener noreferrer"
          className={CTA_PRIMARY}
        >
          Contact FCTC Admissions
          <ExternalLink className="w-4 h-4" />
        </Link>
      </section>
    </Container>
  );
}
