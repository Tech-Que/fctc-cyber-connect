"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, CardBody, Container, Input } from "@/components/ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [stubMessage, setStubMessage] = useState<string | null>(null);

  const emailError =
    submitted && !EMAIL_RE.test(email)
      ? "Enter a valid email address."
      : undefined;
  const passwordError =
    submitted && !password ? "Password is required." : undefined;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (EMAIL_RE.test(email) && password) {
      setStubMessage("Auth wires up in Phase 2. Nothing submitted.");
    } else {
      setStubMessage(null);
    }
  }

  return (
    <Container size="sm" className="py-12 flex justify-center">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Welcome Back
          </h1>
          <p className="text-text-muted">
            Sign in to your FCTC Cyber Connect account.
          </p>
        </header>

        <Card>
          <CardBody className="flex flex-col gap-5">
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
              <div>
                <Input
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError}
                />
                <div className="text-right mt-1.5">
                  <Link
                    href="/login"
                    className="text-accent text-sm hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Sign In
              </Button>
            </form>

            {stubMessage && (
              <div
                role="status"
                className="rounded-md bg-bg-subtle border border-border text-sm text-text-muted p-3 text-center"
              >
                {stubMessage}
              </div>
            )}

            <div className="relative flex items-center">
              <div className="flex-1 border-t border-border" />
              <span className="px-3 text-xs uppercase tracking-wider text-text-muted">
                or
              </span>
              <div className="flex-1 border-t border-border" />
            </div>

            <Button
              variant="secondary"
              disabled
              className="w-full"
              title="Coming in Phase 2"
            >
              Continue with GitHub
            </Button>
          </CardBody>
        </Card>

        <p className="text-center text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-accent hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </Container>
  );
}
