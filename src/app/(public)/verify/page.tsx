"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardBody, Container, Input } from "@/components/ui";
import { apiPost } from "@/lib/api/client";

function VerifyPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    const queryEmail = searchParams.get("email");
    if (queryEmail) setEmail(queryEmail);
  }, [searchParams]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setResendMessage(null);
    if (!email || code.length !== 6) {
      setServerError("Email and 6-digit code are required.");
      return;
    }
    setSubmitting(true);
    try {
      await apiPost("/api/auth/confirm", { email, code });
      router.push("/login?verified=1");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Verification failed.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setServerError(null);
    setResendMessage(null);
    if (!email) {
      setServerError("Enter your email first.");
      return;
    }
    setResending(true);
    try {
      await apiPost("/api/auth/resend-verification", { email });
      setResendMessage("New code sent. Check your email.");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Resend failed.");
    } finally {
      setResending(false);
    }
  }

  return (
    <Container size="sm" className="py-12 flex justify-center">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Verify Your Email
          </h1>
          <p className="text-text-muted">
            We sent a 6-digit code to your email. Enter it below to activate
            your account.
          </p>
        </header>

        <Card>
          <CardBody className="flex flex-col gap-5">
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Verification code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
              />

              {serverError && (
                <p role="alert" className="text-sm text-danger text-center">
                  {serverError}
                </p>
              )}
              {resendMessage && (
                <p role="status" className="text-sm text-success text-center">
                  {resendMessage}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Verifying..." : "Verify"}
              </Button>
            </form>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? "Sending..." : "Didn't get a code? Resend"}
            </button>
          </CardBody>
        </Card>

        <p className="text-center text-sm text-text-muted">
          Wrong account?{" "}
          <Link
            href="/signup"
            className="text-accent hover:underline font-medium"
          >
            Start over
          </Link>
        </p>
      </div>
    </Container>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyPageInner />
    </Suspense>
  );
}
