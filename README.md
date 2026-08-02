# Blocks Login Demo (React + OIDC + PKCE)

A minimal, working login system for a React SPA authenticating against
Blocks as the Identity Provider, using the Authorization Code + PKCE flow.

## Setup

```bash
npm install
cp .env.example .env
# fill in .env — see comments in that file for where each value comes from
npm run dev
```

Then open `http://myapp.local:5173` (or whatever host/port you configured
in `VITE_OIDC_REDIRECT_URI` — it must match exactly what you registered).

## Where to get the .env values

1. Blocks Cloud console → **Core Services → Authentication**
2. Confirm **SSO** is enabled and **Authorization Code** grant type is enabled
   (login will fail silently otherwise — this is a documented Blocks
   requirement, not a bug in this code)
3. Go to the **OIDC** tab → **Create** → fill in Client Name, Redirect URL,
   Audience, Scope (fixed to `openid`)
4. Copy the generated **Client ID** and **Well-Known URL** into `.env`
   (do NOT put the Client Secret in this app — it's a public/browser client,
   see "Security notes" below)
5. Get **X-Blocks-Key** from the Environment Overview page

## File map

```
src/lib/pkce.js          — PKCE verifier/challenge/state generation
src/lib/oidcConfig.js     — env config + discovery document fetch (cached)
src/lib/OidcError.js      — typed error for all OIDC failure paths
src/lib/tokenStore.js     — single place tokens are read/written
src/lib/authClient.js     — login() / handleCallback() / refresh / logout
src/context/AuthContext.jsx — React state wrapper around authClient
src/components/ProtectedRoute.jsx — redirects to login if not authenticated
src/pages/Login.jsx       — login button
src/pages/Callback.jsx    — handles the redirect back from Blocks
src/pages/Dashboard.jsx   — example protected page
```

## Error cases this already handles

| Scenario | What happens |
|---|---|
| Discovery document fetch fails | Falls back to a cached copy if one exists (up to 1hr old); otherwise throws with a clear message |
| `state` mismatch on callback | Throws `OidcError("state_mismatch", ...)` instead of silently logging in — protects against CSRF |
| `code_verifier` missing (e.g. sessionStorage cleared between redirect and callback) | Throws `OidcError("missing_verifier", ...)` with an actionable message, doesn't crash |
| IdP returns `?error=...` on the callback URL | Surfaced as `OidcError` with the IdP's own error code/description |
| Token exchange fails (bad code, PKCE mismatch, etc.) | Reads and surfaces the server's `error`/`error_description`, not just "request failed" |
| Access token expired | Transparently refreshed via `refresh_token` grant before any protected action runs |
| Refresh token itself expired/revoked | Local session is cleared and the user is treated as logged out (not stuck in a broken state) |
| React 18 StrictMode double-invoking effects in dev | `Callback.jsx` guards with a ref so the code exchange only fires once (authorization codes are single-use — a double-fire would break login in dev) |
| Network failure calling the token endpoint | Caught and wrapped as `OidcError("network_error", ...)` rather than an unhandled promise rejection |

## Known limitation (by design, not a bug)

Blocks' discovery document does not expose a standard `end_session_endpoint`.
`logout()` therefore only clears the **local** session (tokens removed from
this browser tab). If your Blocks project needs a server-side session
invalidated too, that requires a separate call your platform/admin team can
confirm the exact path for — don't guess it, the same way `/localization/v1`
vs `/localization/v4` mattered earlier.

## Security notes

- This demo stores tokens in `sessionStorage` (see comment at the top of
  `tokenStore.js`). That's readable by any script on the page — acceptable
  for a demo/internal tool, but for anything handling sensitive data prefer
  a backend-for-frontend that keeps tokens in an HttpOnly cookie.
- No `client_secret` is used anywhere in this app. If the OIDC client you
  created in Blocks Cloud also generated a secret, do not put it in this
  frontend code — a secret embedded in browser JS isn't a secret. If your
  use case requires a confidential client, do the token exchange from your
  own backend instead and have this app talk to that backend.
