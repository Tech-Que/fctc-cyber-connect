export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col gap-8 items-start max-w-3xl">
      <h1 className="text-4xl font-bold text-accent-cyan">
        FCTC Cyber Connect
      </h1>
      <p className="text-text-muted">
        Theme verification: cyber-dark palette via Tailwind 4{" "}
        <code className="font-mono text-accent-cyan">@theme</code> directives.
        Inter for body text, JetBrains Mono for code.
      </p>
      <div className="flex gap-4 items-center flex-wrap">
        <button
          type="button"
          className="rounded-xl bg-accent-cyan text-bg-base font-semibold px-5 py-2 hover:bg-accent-blue transition-colors"
        >
          Primary button
        </button>
        <code className="font-mono text-sm text-accent-cyan bg-bg-card border border-white/5 rounded px-2 py-1">
          src/app/page.tsx
        </code>
      </div>
      <p className="text-sm text-text-muted mt-8">
        Throwaway verification page. Step 6 replaces this with real landing
        content.
      </p>
    </main>
  );
}
