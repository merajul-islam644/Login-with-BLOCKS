import {
  LogIn,
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { login, error, status } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-20">
          {/* =====================================================
              LEFT SIDE
          ====================================================== */}
          <div className="hidden flex-col justify-center lg:flex">
            {/* Brand Badge */}
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Welcome to
                </p>
                <p className="text-lg font-bold tracking-tight">
                  BLOCKS Platform
                </p>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
              One secure gateway to your
              <span className="mt-2 block bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                BLOCKS Workspace
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
              Securely access your BLOCKS applications with a single enterprise
              identity. Simple, fast, and protected by modern authentication
              standards.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-4">
              <Feature
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Enterprise Security"
                description="OAuth 2.0 & OpenID Connect based authentication."
              />

              <Feature
                icon={<Lock className="h-5 w-5" />}
                title="Single Sign-On"
                description="One account gives you access to your applications."
              />

              <Feature
                icon={<Sparkles className="h-5 w-5" />}
                title="Fast & Reliable"
                description="Designed for secure enterprise workflows."
              />
            </div>

            {/* Trust Badge */}
            <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>

              <span>Protected with industry-standard authentication</span>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Login Card */}
              <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 sm:p-10">
                {/* Card Glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

                {/* Logo */}
                <div className="relative mb-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />

                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground shadow-xl shadow-primary/25">
                      <ShieldCheck className="h-10 w-10" />
                    </div>
                  </div>
                </div>

                {/* Heading */}
                <div className="relative text-center">
                  <h2 className="text-3xl font-bold tracking-tight">
                    Welcome Back
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Sign in with your BLOCKS account to continue
                  </p>
                </div>

                {/* Login Button */}
                <Button
                  size="lg"
                  className="group mt-8 h-13 w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
                  onClick={() => login("/dashboard")}
                  disabled={status === "loading"}
                >
                  <LogIn className="h-5 w-5" />

                  {status === "loading" ? (
                    "Redirecting..."
                  ) : (
                    <>
                      Continue with BLOCKS
                      <ArrowRight className="ml-auto h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>

                {/* Error */}
                {error && (
                  <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                        <ShieldCheck className="h-5 w-5 text-destructive" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-destructive">
                          Authentication Failed
                        </p>

                        <p className="mt-1 text-sm leading-5 text-destructive/80">
                          {error.message}
                        </p>

                        <p className="mt-2 text-xs text-muted-foreground">
                          Error Code: {error.code}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Information */}
                <div className="mt-7 rounded-2xl border bg-muted/30 p-5">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Lock className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-semibold">Secure Authentication</p>

                      <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                        You’ll be redirected to the BLOCKS Identity Provider
                        using OAuth 2.0 and OpenID Connect.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-7 h-px bg-border" />

                {/* Terms */}
                <div className="text-center text-xs leading-5 text-muted-foreground">
                  By continuing, you agree to our{" "}
                  <button className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline">
                    Terms
                  </button>{" "}
                  and{" "}
                  <button className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline">
                    Privacy Policy
                  </button>
                </div>
              </div>

              {/* Copyright */}
              <p className="mt-6 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} BLOCKS Platform
                <span className="mx-2">•</span>
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   FEATURE COMPONENT
===================================================== */

function Feature({ icon, title, description }) {
  return (
    <div className="group flex max-w-lg items-center gap-4 rounded-2xl border border-transparent p-3 transition-all hover:border-border hover:bg-background/60">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold tracking-tight">{title}</h3>

        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

// import { LogIn, ShieldCheck, Lock, Sparkles } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import { Button } from "@/components/ui/button";

// export default function Login() {
//   const { login, error, status } = useAuth();

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-50 via-background to-blue-50 dark:from-slate-950 dark:via-background dark:to-slate-900">
//       <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
//         <div className="grid w-full gap-10 lg:grid-cols-2">
//           {/* Left Side */}
//           <div className="hidden flex-col justify-center lg:flex">
//             <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
//               <ShieldCheck className="h-8 w-8" />
//             </div>

//             <h1 className="max-w-lg text-5xl font-bold leading-tight tracking-tight">
//               Secure access to your
//               <span className="block text-primary">BLOCKS Workspace</span>
//             </h1>

//             <p className="mt-6 max-w-xl text-lg text-muted-foreground">
//               Sign in once to securely access all your BLOCKS applications with
//               enterprise-grade authentication powered by OpenID Connect.
//             </p>

//             <div className="mt-10 space-y-5">
//               <Feature
//                 icon={<ShieldCheck className="h-5 w-5" />}
//                 title="Enterprise Security"
//                 description="Modern authentication with OAuth2 & OIDC."
//               />

//               <Feature
//                 icon={<Lock className="h-5 w-5" />}
//                 title="Single Sign-On"
//                 description="Access every BLOCKS application using one account."
//               />

//               <Feature
//                 icon={<Sparkles className="h-5 w-5" />}
//                 title="Fast & Reliable"
//                 description="Built for secure, scalable enterprise workflows."
//               />
//             </div>
//           </div>

//           {/* Right Side */}
//           <div className="flex items-center justify-center">
//             <div className="w-full max-w-md">
//               <div className="rounded-3xl border bg-card/90 p-8 shadow-2xl backdrop-blur">
//                 {/* Logo */}
//                 <div className="mb-8 flex justify-center">
//                   <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
//                     <ShieldCheck className="h-8 w-8" />
//                   </div>
//                 </div>

//                 <div className="text-center">
//                   <h2 className="text-3xl font-bold">Welcome Back</h2>

//                   <p className="mt-2 text-muted-foreground">
//                     Sign in with your BLOCKS account
//                   </p>
//                 </div>

//                 <Button
//                   size="lg"
//                   className="mt-8 h-12 w-full gap-2 text-base"
//                   onClick={() => login("/dashboard")}
//                   disabled={status === "loading"}
//                 >
//                   <LogIn className="h-5 w-5" />

//                   {status === "loading"
//                     ? "Redirecting..."
//                     : "Continue with BLOCKS"}
//                 </Button>

//                 {error && (
//                   <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
//                     <div className="flex gap-3">
//                       <ShieldCheck className="mt-0.5 h-5 w-5 text-destructive" />

//                       <div>
//                         <p className="font-semibold text-destructive">
//                           Authentication Failed
//                         </p>

//                         <p className="mt-1 text-sm text-destructive/90">
//                           {error.message}
//                         </p>

//                         <p className="mt-1 text-xs text-muted-foreground">
//                           Error Code: {error.code}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="mt-8 rounded-xl border bg-muted/50 p-4">
//                   <div className="flex gap-3">
//                     <Lock className="mt-0.5 h-5 w-5 text-primary" />

//                     <div>
//                       <p className="font-medium">Secure Authentication</p>

//                       <p className="mt-1 text-sm text-muted-foreground">
//                         You'll be redirected to the BLOCKS Identity Provider for
//                         secure authentication using industry-standard OAuth 2.0
//                         and OpenID Connect.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
//                   By continuing, you agree to our{" "}
//                   <button className="font-medium text-primary hover:underline">
//                     Terms
//                   </button>{" "}
//                   and{" "}
//                   <button className="font-medium text-primary hover:underline">
//                     Privacy Policy
//                   </button>
//                 </div>
//               </div>

//               <p className="mt-6 text-center text-sm text-muted-foreground">
//                 © {new Date().getFullYear()} BLOCKS Platform. All rights
//                 reserved.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Feature({ icon, title, description }) {
//   return (
//     <div className="flex items-start gap-4">
//       <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
//         {icon}
//       </div>

//       <div>
//         <h3 className="font-semibold">{title}</h3>

//         <p className="mt-1 text-sm text-muted-foreground">{description}</p>
//       </div>
//     </div>
//   );
// }
