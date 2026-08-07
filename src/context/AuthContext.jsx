import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authClient from "../lib/authClient";
import { getTokens, clearTokens } from "../lib/tokenStore";
import { decodeJwtPayload } from "../lib/jwt";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading"); // "loading" | "authenticated" | "unauthenticated"
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Keep `user` (decoded id_token claims) in sync with the current session.
  useEffect(() => {
    if (status !== "authenticated") {
      setUser(null);
      return;
    }
    const tokens = getTokens();
    const claims = decodeJwtPayload(tokens?.idToken);
    setUser(
      claims && {
        name: claims.name || claims.preferred_username || claims.email,
        email: claims.email,
        picture: claims.picture,
      },
    );
  }, [status]);

  // On mount: check for an existing (possibly expired-but-refreshable) session.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const tokens = getTokens();
      if (!tokens) {
        if (!cancelled) setStatus("unauthenticated");
        return;
      }
      try {
        await authClient.getValidAccessToken(); // refreshes if needed
        if (!cancelled) setStatus("authenticated");
      } catch {
        clearTokens();
        if (!cancelled) setStatus("unauthenticated");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Silent refresh: re-check shortly before the current access token expires.
  useEffect(() => {
    if (status !== "authenticated") return undefined;

    const tokens = getTokens();
    if (!tokens?.expiresAt) return undefined;

    const msUntilRefresh = Math.max(
      tokens.expiresAt - Date.now() - 60_000,
      5_000,
    );
    const timer = setTimeout(async () => {
      try {
        await authClient.refreshAccessToken();
        // trigger re-render / reschedule by flipping status through itself
        setStatus("authenticated");
      } catch (err) {
        setError(err);
        setStatus("unauthenticated");
      }
    }, msUntilRefresh);

    return () => clearTimeout(timer);
  }, [status]);

  const login = useCallback(async (returnTo) => {
    setError(null);
    try {
      await authClient.login(returnTo);
      // browser navigates away; nothing else to do here
    } catch (err) {
      setError(err);
    }
  }, []);

  const logout = useCallback(() => {
    authClient.logout();
    setStatus("unauthenticated");
  }, []);

  const completeLogin = useCallback(async () => {
    setError(null);
    try {
      const { returnTo } = await authClient.handleCallback();
      setStatus("authenticated");
      return returnTo;
    } catch (err) {
      setError(err);
      setStatus("unauthenticated");
      throw err;
    }
  }, []);

  const getAccessToken = useCallback(
    () => authClient.getValidAccessToken(),
    [],
  );

  const value = useMemo(
    () => ({
      status,
      error,
      user,
      login,
      logout,
      completeLogin,
      getAccessToken,
    }),
    [status, error, user, login, logout, completeLogin, getAccessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be used within an <AuthProvider>.");
  }
  return ctx;
}
