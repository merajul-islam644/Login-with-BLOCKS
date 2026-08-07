// OIDC runtime configuration.
// All values come from env vars (Vite) so dev/stage/prod can differ without
// code changes. See .env.example for what each one is and where to find it.

export const OIDC_CONFIG = {
  clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirectUri: import.meta.env.VITE_OIDC_REDIRECT_URI,
  wellKnownUrl: import.meta.env.VITE_OIDC_WELL_KNOWN_URL,
  blocksKey: import.meta.env.VITE_X_BLOCKS_KEY,
  scope: "openid profile email offline_access",
};

const DISCOVERY_CACHE_KEY = "oidc_discovery_document";
const DISCOVERY_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Fetches the OIDC discovery document (.well-known/openid-configuration)
 * and caches it in sessionStorage so we don't refetch on every page load.
 * Falls back to a stale cached copy if the network request fails.
 */
export async function getDiscoveryDocument() {
  if (!OIDC_CONFIG.wellKnownUrl) {
    throw new Error(
      "VITE_OIDC_WELL_KNOWN_URL is not set. Get this from your OIDC client " +
        "configuration in Blocks Cloud (Core Services -> Authentication -> OIDC).",
    );
  }

  const cached = readCache();
  if (cached) return cached;

  try {
    const response = await fetch(OIDC_CONFIG.wellKnownUrl);
    if (!response.ok) {
      throw new Error(`Discovery document fetch failed: ${response.status}`);
    }
    const doc = await response.json();
    writeCache(doc);
    return doc;
  } catch (err) {
    const stale = readCache(/* ignoreExpiry */ true);
    if (stale) {
      console.warn(
        "Using stale OIDC discovery document after fetch failure:",
        err,
      );
      return stale;
    }
    throw err;
  }
}

function readCache(ignoreExpiry = false) {
  try {
    const raw = sessionStorage.getItem(DISCOVERY_CACHE_KEY);
    if (!raw) return null;
    const { doc, cachedAt } = JSON.parse(raw);
    if (!ignoreExpiry && Date.now() - cachedAt > DISCOVERY_CACHE_TTL_MS) {
      return null;
    }
    return doc;
  } catch {
    return null;
  }
}

function writeCache(doc) {
  try {
    sessionStorage.setItem(
      DISCOVERY_CACHE_KEY,
      JSON.stringify({ doc, cachedAt: Date.now() }),
    );
  } catch {
    // sessionStorage unavailable (e.g. private browsing) — non-fatal, just skip caching
  }
}
