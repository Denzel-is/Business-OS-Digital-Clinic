export const BACKEND_COOKIE_NAMES = ["BUSINESS_OS_SESSION", "XSRF-TOKEN"] as const;

export function filterBackendCookieHeader(cookieHeader: string | null): string {
  if (!cookieHeader) {
    return "";
  }

  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter((cookie) => BACKEND_COOKIE_NAMES.some((name) => cookie.startsWith(`${name}=`)))
    .join("; ");
}

export function getSetCookieValues(headers: Headers): string[] {
  const extendedHeaders = headers as Headers & { getSetCookie?: () => string[] };
  const values = extendedHeaders.getSetCookie?.();
  if (values?.length) {
    return values;
  }

  const combined = headers.get("set-cookie");
  return combined ? combined.split(/,(?=\s*[!#$%&'*+\-.^_`|~0-9A-Za-z]+=)/) : [];
}

export function copyBackendSetCookies(source: Headers, target: Headers) {
  for (const cookie of getSetCookieValues(source)) {
    if (BACKEND_COOKIE_NAMES.some((name) => cookie.startsWith(`${name}=`))) {
      target.append("Set-Cookie", cookie);
    }
  }
}
