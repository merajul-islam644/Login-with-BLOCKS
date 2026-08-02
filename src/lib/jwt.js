// Minimal, dependency-free JWT payload decoder.
//
// This does NOT verify the token's signature — it's used purely to read
// display claims (name/email/picture) from an id_token that was already
// validated server-side during the code exchange. Never use this to make
// authorization decisions; only the backend/resource server should do that.

/** @returns {Record<string, unknown> | null} */
export function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
