"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, Container, Input } from "@/components/ui";
import { apiPost } from "@/lib/api/client";
import { cn } from "@/lib/utils/cn";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignupRole = "prospective" | "current" | "alumni";

const ROLES: Array<{ key: SignupRole; name: string; desc: string }> = [
  {
    key: "prospective",
    name: "Prospective Student",
    desc: "Exploring the program, asking questions, considering applying.",
  },
  {
    key: "current",
    name: "Current Student",
    desc: "Actively enrolled in the FCTC cybersecurity program.",
  },
  {
    key: "alumni",
    name: "Alumni",
    desc: "Completed the program and joining the alumni network.",
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<SignupRole | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const nameError =
    submitted && !name.trim() ? "Display name is required." : undefined;
  const emailError =
    submitted && !EMAIL_RE.test(email)
      ? "Enter a valid email address."
      : undefined;
  const passwordError =
    submitted && password.length < 8
      ? "Password must be at least 8 characters."
      : undefined;
  const confirmError =
    submitted && confirm !== password ? "Passwords don't match." : undefined;
  const roleError = submitted && !role ? "Please select a role." : undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);
    const valid =
      name.trim() &&
      EMAIL_RE.test(email) &&
      password.length >= 8 &&
      confirm === password &&
      role;
    if (!valid) return;

    setSubmitting(true);
    try {
      await apiPost("/api/auth/signup", {
        email,
        password,
        displayName: name.trim(),
        role,
      });
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container size="sm" className="py-12 flex justify-center">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Create Your Account
          </h1>
          <p className="text-text-muted">
            Join the FCTC Cyber Connect community.
          </p>
        </header>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Display Name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={nameError}
              />
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
              />
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                hint="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
              />
              <Input
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={confirmError}
              />

              <fieldset className="flex flex-col gap-2">
                <legend className="block text-sm font-medium text-text-primary mb-1.5">
                  I am a...
                </legend>
                <div className="flex flex-col gap-2">
                  {ROLES.map((r) => {
                    const selected = role === r.key;
                    return (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setRole(r.key)}
                        aria-pressed={selected}
                        className={cn(
                          "text-left px-4 py-3 rounded-lg border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
                          selected
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-text-muted",
                        )}
                      >
                        <div className="font-medium text-text-primary">
                          {r.name}
                        </div>
                        <div className="text-sm text-text-muted">{r.desc}</div>
                      </button>
                    );
                  })}
                </div>
                {roleError && (
                  <p className="text-sm text-danger mt-1">{roleError}</p>
                )}
              </fieldset>

              <p className="text-xs text-text-muted">
                By creating an account, you agree to FCTC&apos;s acceptable use
                policies.
              </p>

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
                {submitting ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardBody>
        </Card>

        <p className="text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </Container>
  );
}
