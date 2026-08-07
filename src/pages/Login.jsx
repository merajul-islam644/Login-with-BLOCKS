import { LogIn, ShieldCheck, Lock, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { login, error, status } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-background to-blue-50 dark:from-slate-950 dark:via-background dark:to-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-2">
          {/* Left Side */}
          <div className="hidden flex-col justify-center lg:flex">
            <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <h1 className="max-w-lg text-5xl font-bold leading-tight tracking-tight">
              Secure access to your
              <span className="block text-primary">BLOCKS Workspace</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Sign in once to securely access all your BLOCKS applications with
              enterprise-grade authentication powered by OpenID Connect.
            </p>

            <div className="mt-10 space-y-5">
              <Feature
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Enterprise Security"
                description="Modern authentication with OAuth2 & OIDC."
              />

              <Feature
                icon={<Lock className="h-5 w-5" />}
                title="Single Sign-On"
                description="Access every BLOCKS application using one account."
              />

              <Feature
                icon={<Sparkles className="h-5 w-5" />}
                title="Fast & Reliable"
                description="Built for secure, scalable enterprise workflows."
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="rounded-3xl border bg-card/90 p-8 shadow-2xl backdrop-blur">
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-3xl font-bold">Welcome Back</h2>

                  <p className="mt-2 text-muted-foreground">
                    Sign in with your BLOCKS account
                  </p>
                </div>

                <Button
                  size="lg"
                  className="mt-8 h-12 w-full gap-2 text-base"
                  onClick={() => login("/dashboard")}
                  disabled={status === "loading"}
                >
                  <LogIn className="h-5 w-5" />

                  {status === "loading"
                    ? "Redirecting..."
                    : "Continue with BLOCKS"}
                </Button>

                {error && (
                  <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                    <div className="flex gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 text-destructive" />

                      <div>
                        <p className="font-semibold text-destructive">
                          Authentication Failed
                        </p>

                        <p className="mt-1 text-sm text-destructive/90">
                          {error.message}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Error Code: {error.code}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 rounded-xl border bg-muted/50 p-4">
                  <div className="flex gap-3">
                    <Lock className="mt-0.5 h-5 w-5 text-primary" />

                    <div>
                      <p className="font-medium">Secure Authentication</p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        You'll be redirected to the BLOCKS Identity Provider for
                        secure authentication using industry-standard OAuth 2.0
                        and OpenID Connect.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
                  By continuing, you agree to our{" "}
                  <button className="font-medium text-primary hover:underline">
                    Terms
                  </button>{" "}
                  and{" "}
                  <button className="font-medium text-primary hover:underline">
                    Privacy Policy
                  </button>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} BLOCKS Platform. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold">{title}</h3>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
