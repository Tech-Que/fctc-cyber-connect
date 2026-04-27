"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, CardBody, Container, Input } from "@/components/ui";
import { apiPut } from "@/lib/api/client";

function ResetPasswordPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const queryEmail = searchParams.get("email");
    if (queryEmail) setEmail(queryEmail);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!email) {
      setServerError("Email is required.");
      return;
    }
    if (code.length !== 6) {
      setServerError("Enter the 6-digit code from your email.");
      return;
    }
    if (newPassword.length < 8) {
      setServerError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setServerError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await apiPut("/api/auth/password-reset", { email, code, newPassword });
      router.push("/login?reset=1");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Reset failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container size="sm" className="py-12 flex justify-center">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Reset Password
          </h1>
          <p className="text-text-muted">
            Enter the code from your email and choose a new password.
          </p>
        </header>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Reset code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
              />
              <Input
                label="New password"
                type="password"
                autoComplete="new-password"
                hint="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {submitting ? "Resetting..." : "Reset password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordPageInner />
    </Suspense>
  );
}
