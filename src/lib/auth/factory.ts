import { env } from "@/lib/env";
import type { AuthProvider, AuthProviderName } from "./types";
import { cognitoProvider } from "./providers/cognito";
import { mockAuthProvider } from "./providers/mock";

const providers: Record<AuthProviderName, AuthProvider> = {
  cognito: cognitoProvider,
  mock: mockAuthProvider,
};

export function getAuthProvider(): AuthProvider {
  return providers[env.AUTH_PROVIDER];
}
