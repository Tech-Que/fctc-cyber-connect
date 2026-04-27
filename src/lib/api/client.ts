/**
 * Thin wrapper around fetch for our own /api/* endpoints.
 *
 * - JSON in, JSON out (server is expected to always return JSON, even on errors).
 * - credentials: "include" so the fctc-session / fctc-refresh cookies travel
 *   on every request. Forms wouldn't be authenticated without this.
 * - On non-2xx, throws Error(message) using the server's `error` field if
 *   present, otherwise a generic message. This lets callers do plain
 *   try/catch around apiPost(...) and surface server messages directly.
 */

async function request<T>(
  path: string,
  init: Omit<RequestInit, "body"> & { body?: unknown },
): Promise<T> {
  const { body, headers, ...rest } = init;
  const res = await fetch(path, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  // If the server returned a non-JSON 5xx (e.g. raw HTML error page), don't
  // crash on .json() — treat it as no body and fall through to the status code.
  const data: { error?: string } & Record<string, unknown> = await res
    .json()
    .catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }
  return data as T;
}

export function apiPost<T = unknown>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: "POST", body });
}

export function apiPut<T = unknown>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: "PUT", body });
}

export function apiGet<T = unknown>(path: string): Promise<T> {
  return request<T>(path, { method: "GET" });
}
