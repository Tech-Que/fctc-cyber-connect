import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { env } from "@/lib/env";

/**
 * JWKS for Cognito user pool. Lazily fetched on first verification, cached
 * by jose itself (default: 10 min). One JWKS per user pool, not per request.
 */
let _jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!_jwks) {
    if (!env.COGNITO_USER_POOL_ID || !env.COGNITO_REGION) {
      throw new Error(
        "Cognito JWKS requires COGNITO_USER_POOL_ID and COGNITO_REGION.",
      );
    }
    const jwksUrl = new URL(
      `https://cognito-idp.${env.COGNITO_REGION}.amazonaws.com/${env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
    );
    _jwks = createRemoteJWKSet(jwksUrl);
  }
  return _jwks;
}

export interface CognitoIdTokenClaims extends JWTPayload {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  "custom:role"?: string;
  token_use: "id" | "access";
  "cognito:username": string;
}

/**
 * Verify a Cognito ID token. Validates signature against JWKS, checks issuer,
 * audience (client ID), expiration, and token_use=id.
 *
 * Throws if any check fails. Returns the verified payload on success.
 *
 * Note: this verifies ID tokens specifically. Access tokens have a different
 * token_use claim and lack the aud claim entirely (Cognito quirk) — they
 * would need a separate verifier if we ever needed them. We don't right now.
 */
export async function verifyIdToken(
  token: string,
): Promise<CognitoIdTokenClaims> {
  if (
    !env.COGNITO_USER_POOL_ID ||
    !env.COGNITO_REGION ||
    !env.COGNITO_CLIENT_ID
  ) {
    throw new Error(
      "Cognito JWT verification requires user pool, region, and client ID.",
    );
  }

  const issuer = `https://cognito-idp.${env.COGNITO_REGION}.amazonaws.com/${env.COGNITO_USER_POOL_ID}`;

  const { payload } = await jwtVerify(token, getJWKS(), {
    issuer,
    audience: env.COGNITO_CLIENT_ID,
  });

  const claims = payload as CognitoIdTokenClaims;

  if (claims.token_use !== "id") {
    throw new Error(`Expected token_use=id, got ${claims.token_use}`);
  }

  return claims;
}
