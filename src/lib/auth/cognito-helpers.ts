import { createHmac } from "crypto";
import { env } from "@/lib/env";

/**
 * Cognito requires SECRET_HASH on every API call when the App Client has a secret.
 * Format: HMAC-SHA256(username + clientId), key = clientSecret, base64-encoded.
 */
export function computeSecretHash(username: string): string {
  if (!env.COGNITO_CLIENT_SECRET || !env.COGNITO_CLIENT_ID) {
    throw new Error("Cognito credentials not configured. Check env vars.");
  }
  const message = username + env.COGNITO_CLIENT_ID;
  return createHmac("sha256", env.COGNITO_CLIENT_SECRET)
    .update(message)
    .digest("base64");
}
