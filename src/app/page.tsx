export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col gap-8 items-start max-w-3xl">
      <h1 className="font-display text-4xl font-bold tracking-wide text-text-primary">
        FCTC CYBER CONNECT
      </h1>
      <p className="text-text-muted">
        Theme verification: brand palette with hybrid light/dark strategy.
        Orbitron for display, Inter for body, JetBrains Mono for code.
      </p>
      <div className="flex gap-4 items-center flex-wrap">
        <button
          type="button"
          className="rounded-xl bg-accent text-bg-base font-semibold px-5 py-2 hover:bg-accent-hover transition-colors"
        >
          Primary button
        </button>
        {/*
          Intentional literal: highlight badge uses brand-navy for its text
          because neon green on navy is the specified contrast pair and
          must not swap on theme change. All other components must use
          semantic tokens (bg-bg-*, text-text-*, text-accent, border-border).
        */}
        <span className="rounded-md bg-highlight text-brand-navy font-semibold text-xs uppercase tracking-wide px-2 py-1">
          NEW
        </span>
        <code className="font-mono text-sm text-accent bg-bg-card border border-border rounded px-2 py-1">
          src/app/page.tsx
        </code>
      </div>
      <p className="text-sm text-text-muted mt-8">
        Light mode by default. To preview dark mode, add{" "}
        <code className="font-mono">class=&quot;dark&quot;</code> to{" "}
        <code className="font-mono">&lt;html&gt;</code> in DevTools. Real theme
        toggle lands in Step 5.
      </p>
    </main>
  );
}
