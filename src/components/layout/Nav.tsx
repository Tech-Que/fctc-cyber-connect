"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils/cn";

const primaryLinks = [
  { href: "/program", label: "Program" },
  { href: "/community", label: "Community" },
  { href: "/assistant", label: "Assistant" },
  { href: "/resources", label: "Resources" },
];

// Shared button-like styles for auth CTAs rendered as Links.
// Avoids <a><button>...</button></a> nesting; we can extract a `buttonVariants`
// helper later if more Link-as-button usages appear.
const buttonBase =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 h-8 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base";
const ghostSm = `${buttonBase} bg-transparent text-text-primary hover:bg-bg-subtle`;
const primarySm = `${buttonBase} bg-accent text-bg-base hover:bg-accent-hover`;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function Nav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-bg-base/80 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            <Image
              src="/brand/FCTC_CyberConnect_logo.png"
              alt="FCTC Cyber Connect"
              width={40}
              height={40}
              priority
              className="w-10 h-10 rounded-lg"
            />
            <span className="font-display text-base sm:text-lg font-semibold tracking-wide text-text-primary">
              Cyber Connect
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive(pathname, link.href)
                    ? "text-accent"
                    : "text-text-muted hover:text-text-primary",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className={ghostSm}>
              Login
            </Link>
            <Link href="/signup" className={primarySm}>
              Sign up
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              className="w-10 h-10 rounded-full flex items-center justify-center text-text-primary hover:bg-bg-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-bg-base flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div className="h-16 px-4 flex items-center justify-between border-b border-border">
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Image
                src="/brand/FCTC_CyberConnect_logo.png"
                alt="FCTC Cyber Connect"
                width={40}
                height={40}
                className="w-10 h-10 rounded-lg"
              />
              <span className="font-display text-lg font-semibold tracking-wide text-text-primary">
                Cyber Connect
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full flex items-center justify-center text-text-primary hover:bg-bg-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav
            className="flex-1 px-6 py-8 flex flex-col gap-2"
            aria-label="Mobile menu"
          >
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className={cn(
                  "font-display text-2xl tracking-wide py-3 px-2 rounded-md transition-colors",
                  isActive(pathname, link.href)
                    ? "text-accent"
                    : "text-text-primary hover:bg-bg-subtle",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="px-6 pb-8 flex flex-col gap-3 border-t border-border pt-6">
            <Link
              href="/login"
              onClick={() => setDrawerOpen(false)}
              className={cn(ghostSm, "w-full h-11 text-base")}
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setDrawerOpen(false)}
              className={cn(primarySm, "w-full h-11 text-base")}
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
