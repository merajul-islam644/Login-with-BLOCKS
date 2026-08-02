// Centralized token storage.
//
// Trade-off note: sessionStorage survives page reloads but is readable by
// any script on the page (XSS risk), and is cleared when the tab closes.
// For production, prefer a backend-for-frontend (BFF) that keeps tokens in
// an HttpOnly cookie and never exposes them to JS at all. This module exists
// so that swapping the storage strategy later only requires editing this
// one file — nothing else in the app should read/write storage directly.

const STORAGE_KEY = "blocks_auth_tokens";

/**
 * @typedef {Object} TokenSet
 * @property {string} accessToken
 * @property {string} [refreshToken]
 * @property {string} [idToken]
 * @property {number} expiresAt - epoch ms when accessToken expires
 */

/** @returns {TokenSet | null} */
export function getTokens() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** @param {TokenSet} tokens */
export function setTokens(tokens) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch {
    // storage unavailable — auth will simply not persist across reloads
  }
}

export function clearTokens() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}

export function isExpired(tokens) {
  if (!tokens?.expiresAt) return true;
  // Treat tokens as expired 30s before actual expiry to leave headroom for
  // the refresh request itself.
  return Date.now() >= tokens.expiresAt - 30_000;
}
