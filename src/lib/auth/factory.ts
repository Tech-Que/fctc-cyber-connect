import { env } from "@/lib/env";
import type { AuthProvider, AuthProviderName } from "./types";
import { cognitoProvider } from "./providers/cognito";
import { mockAuthProvider } from "./providers/mock";

const providers: Record<AuthProviderName, AuthProvider> = {
  cognito: cognitoProvider,
  mock: mockAuthProvider,
};

export function getAuthProvider(): AuthProvider {
  const name = env.AUTH_PROVIDER as AuthProviderName;
  const provider = providers[name];
  if (!provider) {
    throw new Error(`Unknown AUTH_PROVIDER: ${name}. Valid: cognito, mock.`);
  }
  return provider;
}
