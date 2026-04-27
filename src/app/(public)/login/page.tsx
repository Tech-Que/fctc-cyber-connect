"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardBody, Container, Input } from "@/components/ui";
import { apiPost } from "@/lib/api/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const justVerified = searchParams.get("verified") === "1";
  const justReset = searchParams.get("reset") === "1";

  const emailError =
    submitted && !EMAIL_RE.test(email)
      ? "Enter a valid email address."
      : undefined;
  const passwordError =
    submitted && !password ? "Password is required." : undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);
    if (!EMAIL_RE.test(email) || !password) return;

    setSubmitting(true);
    try {
      await apiPost("/api/auth/signin", { email, password });
      // Full reload so any cached server-component state from the prior
      // (signed-out) render gets discarded.
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setSubmitting(false);
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
            {(justVerified || justReset) && (
              <div
                role="status"
                className="rounded-md bg-success/10 border border-success text-sm text-success p-3 text-center"
              >
                {justVerified
                  ? "Email verified. You can sign in now."
                  : "Password reset. Sign in with your new password."}
              </div>
            )}

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
                    href="/forgot-password"
                    className="text-accent text-sm hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {serverError && (
                <p
                  role="alert"
                  className="text-sm text-danger text-center"
                >
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

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
              title="Coming later"
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
