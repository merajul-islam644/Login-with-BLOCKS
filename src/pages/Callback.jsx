import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      <div style={{ maxWidth: 480, margin: "80px auto", textAlign: "center" }}>
        <h1>Login failed</h1>
        <p style={{ color: "#b00020" }}>
          <strong>{error.code}:</strong> {error.message}
        </p>
        <button onClick={() => navigate("/login", { replace: true })}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "80px auto", textAlign: "center" }}>
      <p>Completing login…</p>
    </div>
  );
}
