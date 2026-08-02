import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, error, status } = useAuth();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-500">
          You'll be redirected to Blocks to authenticate.
        </p>

        <button
          onClick={() => login(returnTo)}
          disabled={status === "loading"}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-base font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Redirecting..." : "Login with Blocks"}
        </button>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-left text-sm text-red-700"
          >
            <strong className="font-semibold">{error.code}:</strong>{" "}
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
}
