import { z } from "zod";

/**
 * Environment variable schema.
 *
 * Phase 1 only validates what's actually used in code today.
 * Future phases extend this schema as new vars come online.
 *
 * Server-only vars (no NEXT_PUBLIC_ prefix) are NOT exposed to the client.
 * Anything that needs to reach the browser must be NEXT_PUBLIC_*.
 */
const serverEnvSchema = z.object({
  // App identity (Phase 1)
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("FCTC Cyber Connect"),

  // AI provider config (Phase 1 / Phase 5)
  AI_PROVIDER: z.enum(["mock", "ollama", "openai", "bedrock"]).default("mock"),
  OLLAMA_BASE_URL: z.string().url().optional(),
  OLLAMA_MODEL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  AWS_BEDROCK_REGION: z.string().optional(),

  // Database (Phase 3)
  DATABASE_URL: z.string().url().optional(),
  DIRECT_URL: z.string().url().optional(),

  // Auth (Phase 2)
  COGNITO_USER_POOL_ID: z.string().optional(),
  COGNITO_CLIENT_ID: z.string().optional(),
  COGNITO_REGION: z.string().optional(),
  AUTH_SECRET: z.string().min(32).optional(),

  // Storage (later)
  AWS_S3_BUCKET: z.string().optional(),
  AWS_S3_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
});

/**
 * Conditional validation: if AI_PROVIDER=ollama, OLLAMA_BASE_URL must be set.
 * If AI_PROVIDER=openai, OPENAI_API_KEY must be set. Etc.
 *
 * This catches the "I changed AI_PROVIDER but forgot to set the credentials"
 * bug at startup, not at first request.
 */
function validateEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(parsed.error.flatten().fieldErrors, null, 2),
    );
    throw new Error(
      "Invalid environment configuration. Check the errors above.",
    );
  }

  const env = parsed.data;

  if (env.AI_PROVIDER === "ollama" && !env.OLLAMA_BASE_URL) {
    throw new Error("AI_PROVIDER=ollama requires OLLAMA_BASE_URL to be set.");
  }
  if (env.AI_PROVIDER === "openai" && !env.OPENAI_API_KEY) {
    throw new Error("AI_PROVIDER=openai requires OPENAI_API_KEY to be set.");
  }
  if (env.AI_PROVIDER === "bedrock" && !env.AWS_BEDROCK_REGION) {
    throw new Error(
      "AI_PROVIDER=bedrock requires AWS_BEDROCK_REGION to be set.",
    );
  }

  return env;
}

export const env = validateEnv();
export type Env = typeof env;
