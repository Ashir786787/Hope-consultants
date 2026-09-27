export function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip")?.trim();
  return real && real.length > 0 ? real : null;
}

export const UNKNOWN_SOURCE_PAGE = "direct";

export function refererPath(request: Request): string {
  const referer = request.headers.get("referer")?.trim();
  if (!referer) return UNKNOWN_SOURCE_PAGE;
  try {
    const url = new URL(referer);
    return `${url.origin}${url.pathname}`;
  } catch {
    return UNKNOWN_SOURCE_PAGE;
  }
}
