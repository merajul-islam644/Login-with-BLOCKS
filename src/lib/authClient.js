import { generateCodeVerifier, generateCodeChallenge, generateState } from "./pkce";
import { getDiscoveryDocument, OIDC_CONFIG } from "./oidcConfig";
import { getTokens, setTokens, clearTokens, isExpired } from "./tokenStore";
import { OidcError } from "./OidcError";

const VERIFIER_KEY = "oidc_pkce_verifier";
const STATE_KEY = "oidc_state";
const RETURN_TO_KEY = "oidc_return_to";

/**
 * Step 1: kick off login. Redirects the browser to the IdP's authorize
 * endpoint. Call this from a "Login" button handler.
 *
 * @param {string} [returnTo] - app-relative path to return to after login
 */
export async function login(returnTo = "/") {
  const discovery = await getDiscoveryDocument();

  if (!discovery.authorization_endpoint) {
    throw new OidcError(
      "missing_authorization_endpoint",
      "Discovery document has no authorization_endpoint.",
    );
  }

  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  const state = generateState();

  sessionStorage.setItem(VERIFIER_KEY, verifier);
  sessionStorage.setItem(STATE_KEY, state);
  sessionStorage.setItem(RETURN_TO_KEY, returnTo);

  const params = new URLSearchParams({
    client_id: OIDC_CONFIG.clientId,
    response_type: "code",
    redirect_uri: OIDC_CONFIG.redirectUri,
    scope: OIDC_CONFIG.scope,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  window.location.href = `${discovery.authorization_endpoint}${
    discovery.authorization_endpoint.includes("?") ? "&" : "?"
  }${params.toString()}`;
}

/**
 * Step 2: call this from the /callback route. Reads `code` and `state` from
 * the current URL, validates state, exchanges the code for tokens.
 *
 * @returns {Promise<{returnTo: string}>}
 * @throws {OidcError}
 */
export async function handleCallback() {
  const url = new URL(window.location.href);
  const error = url.searchParams.get("error");
  if (error) {
    throw new OidcError(
      error,
      url.searchParams.get("error_description") || "Login was denied or failed.",
    );
  }

  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");

  if (!code) {
    throw new OidcError("missing_code", "No authorization code in callback URL.");
  }

  const expectedState = sessionStorage.getItem(STATE_KEY);
  if (!expectedState || returnedState !== expectedState) {
    throw new OidcError(
      "state_mismatch",
      "The state parameter did not match. This can happen if the login was " +
        "started in a different tab, or points to a possible CSRF attempt. " +
        "Please try logging in again.",
    );
  }

  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  if (!verifier) {
    throw new OidcError(
      "missing_verifier",
      "PKCE code_verifier was lost (e.g. sessionStorage cleared between " +
        "redirect and callback). Please try logging in again.",
    );
  }

  const discovery = await getDiscoveryDocument();
  const tokens = await exchangeCodeForTokens(discovery.token_endpoint, code, verifier);

  setTokens(tokens);

  const returnTo = sessionStorage.getItem(RETURN_TO_KEY) || "/";
  sessionStorage.removeItem(VERIFIER_KEY);
  sessionStorage.removeItem(STATE_KEY);
  sessionStorage.removeItem(RETURN_TO_KEY);

  return { returnTo };
}

async function exchangeCodeForTokens(tokenEndpoint, code, verifier) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: OIDC_CONFIG.redirectUri,
    client_id: OIDC_CONFIG.clientId,
    code_verifier: verifier,
  });

  let response;
  try {
    response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch (err) {
    throw new OidcError("network_error", "Could not reach the token endpoint.", err);
  }

  const data = await safeJson(response);

  if (!response.ok) {
    throw new OidcError(
      data?.error || "token_exchange_failed",
      data?.error_description || `Token exchange failed (HTTP ${response.status}).`,
      data,
    );
  }

  return normalizeTokenResponse(data);
}

/**
 * Refreshes the access token using the stored refresh_token.
 * Returns the new token set, or null if there's no refresh_token to use
 * (caller should redirect to login in that case).
 */
export async function refreshAccessToken() {
  const current = getTokens();
  if (!current?.refreshToken) return null;

  const discovery = await getDiscoveryDocument();
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: current.refreshToken,
    client_id: OIDC_CONFIG.clientId,
  });

  let response;
  try {
    response = await fetch(discovery.token_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch (err) {
    throw new OidcError("network_error", "Could not reach the token endpoint.", err);
  }

  const data = await safeJson(response);

  if (!response.ok) {
    // Refresh token itself expired/revoked — caller must re-login.
    clearTokens();
    throw new OidcError(
      data?.error || "refresh_failed",
      data?.error_description || "Session expired. Please log in again.",
      data,
    );
  }

  const tokens = normalizeTokenResponse(data, current.refreshToken);
  setTokens(tokens);
  return tokens;
}

/**
 * Returns a valid access token, transparently refreshing it if it's expired.
 * Throws OidcError("no_session", ...) if there's nothing to work with.
 */
export async function getValidAccessToken() {
  const tokens = getTokens();
  if (!tokens) {
    throw new OidcError("no_session", "Not logged in.");
  }
  if (!isExpired(tokens)) {
    return tokens.accessToken;
  }
  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    throw new OidcError("no_session", "Session expired and no refresh token available.");
  }
  return refreshed.accessToken;
}

export function isAuthenticated() {
  const tokens = getTokens();
  return Boolean(tokens && (!isExpired(tokens) || tokens.refreshToken));
}

/**
 * Clears the local session. Note: Blocks' discovery document does not
 * expose a standard `end_session_endpoint`, so this performs a LOCAL logout
 * only (clears tokens client-side). If you need to also invalidate the
 * session server-side, call your backend's logout endpoint separately —
 * confirm the exact path with your Blocks Cloud admin/API reference before
 * relying on it, since it wasn't present in the discovery document.
 */
export function logout() {
  clearTokens();
}

function normalizeTokenResponse(data, previousRefreshToken) {
  const accessToken = data.access_token ?? data.AccessToken;
  const refreshToken = data.refresh_token ?? data.RefreshToken ?? previousRefreshToken;
  const idToken = data.id_token ?? data.IdToken;
  const expiresIn = Number(data.expires_in ?? data.ExpiresIn ?? 3600);

  if (!accessToken) {
    throw new OidcError(
      "malformed_token_response",
      "Token endpoint response did not include an access token.",
      data,
    );
  }

  return {
    accessToken,
    refreshToken,
    idToken,
    expiresAt: Date.now() + expiresIn * 1000,
  };
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
