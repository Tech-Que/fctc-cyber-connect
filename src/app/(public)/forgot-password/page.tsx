"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, CardBody, Container, Input } from "@/components/ui";
import { apiPost } from "@/lib/api/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const emailError =
    submitted && !EMAIL_RE.test(email)
      ? "Enter a valid email address."
      : undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);
    if (!EMAIL_RE.test(email)) return;

    setSubmitting(true);
    try {
      await apiPost("/api/auth/password-reset", { email });
      setSent(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <Container size="sm" className="py-12 flex justify-center">
        <div className="w-full max-w-md flex flex-col gap-6">
          <Card>
            <CardBody className="flex flex-col gap-5 text-center">
              <h1 className="font-display text-2xl font-bold text-text-primary">
                Check your email
              </h1>
              <p className="text-text-muted text-sm">
                If an account exists for{" "}
                <span className="font-mono text-text-primary">{email}</span>, a
                reset code has been sent.
              </p>
              <Link
                href={`/reset-password?email=${encodeURIComponent(email)}`}
                className="block"
              >
                <Button variant="primary" className="w-full">
                  I have a code
                </Button>
              </Link>
              <Link
                href="/login"
                className="text-sm text-accent hover:underline"
              >
                Back to sign in
              </Link>
            </CardBody>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container size="sm" className="py-12 flex justify-center">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Forgot Password?
          </h1>
          <p className="text-text-muted">
            Enter your email and we&apos;ll send you a code to reset it.
          </p>
        </header>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
              />

              {serverError && (
                <p role="alert" className="text-sm text-danger text-center">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Sending..." : "Send reset code"}
              </Button>
            </form>
          </CardBody>
        </Card>

        <p className="text-center text-sm">
          <Link
            href="/login"
            className="text-accent hover:underline font-medium"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </Container>
  );
}
