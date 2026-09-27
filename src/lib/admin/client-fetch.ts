const REQUEST_TIMEOUT_MS = 25_000;

export class ClientRequestError extends Error {}

export const REQUEST_TIMEOUT_MESSAGE =
  "That took longer than expected. Please check your connection and try again.";

export async function fetchWithTimeout(
  input: string,
  init?: RequestInit,
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ClientRequestError(REQUEST_TIMEOUT_MESSAGE);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export function requestErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ClientRequestError ? error.message : fallback;
}
