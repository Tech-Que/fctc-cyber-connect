import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-bg-subtle border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
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
          </div>
          <p className="font-display text-sm font-semibold tracking-[0.2em] text-accent">
            CONNECT. LEARN. PROTECT.
          </p>
          <p className="text-sm text-text-muted max-w-sm">
            The community hub for First Coast Technical College&apos;s
            cybersecurity program — for prospective students, current
            students, and alumni.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-primary">
            Quick links
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link
                href="/program"
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                Program
              </Link>
            </li>
            <li>
              <Link
                href="/community"
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                Community
              </Link>
            </li>
            <li>
              <Link
                href="/resources"
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                Resources
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 md:text-right">
          <p className="text-sm text-text-muted">
            Built for First Coast Technical College.
          </p>
          <p className="text-xs text-text-muted">
            © 2026 FCTC Cyber Connect
          </p>
        </div>
      </div>
    </footer>
  );
}
