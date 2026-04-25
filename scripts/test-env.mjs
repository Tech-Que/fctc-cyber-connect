// Test runner for src/lib/env.ts validation. Run via tsx so the TS module
// loads and triggers validateEnv() at import time. Exit code 0 on success,
// 1 on any thrown error (so a bash test loop can detect failure).

try {
  const mod = await import("../src/lib/env.ts");
  const env = mod.env;
  if (!env) throw new Error("Module loaded but `env` export missing");
  console.log("OK | AI_PROVIDER=" + env.AI_PROVIDER);
  process.exit(0);
} catch (err) {
  console.error("FAIL:", err.message);
  process.exit(1);
}
