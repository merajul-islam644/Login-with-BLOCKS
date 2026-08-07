import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Callback() {
  const { completeLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const ranOnce = useRef(false); // guards against React StrictMode double-invoke in dev

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    (async () => {
      try {
        const returnTo = await completeLogin();
        navigate(returnTo, { replace: true });
      } catch (err) {
        setError(err);
      }
    })();
  }, [completeLogin, navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-6 w-6" />
          </div>

          <h1 className="mt-4 text-xl font-medium">Login failed</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Error code: {error.code}
          </p>

          <Button
            className="mt-6 w-full"
            onClick={() => navigate("/login", { replace: true })}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Completing login…</p>
    </div>
  );
}
