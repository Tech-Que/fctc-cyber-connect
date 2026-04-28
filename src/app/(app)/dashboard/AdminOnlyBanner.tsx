"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AdminOnlyBannerInner() {
  const searchParams = useSearchParams();
  if (searchParams.get("error") !== "admin-only") return null;
  return (
    <div
      role="status"
      className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300"
    >
      The admin area requires the admin role. You&apos;ve been redirected to
      your dashboard.
    </div>
  );
}

export function AdminOnlyBanner() {
  // Client-component island so the dashboard page itself can stay a server
  // component. Suspense boundary required because useSearchParams forces a
  // bailout from static prerender otherwise.
  return (
    <Suspense>
      <AdminOnlyBannerInner />
    </Suspense>
  );
}
