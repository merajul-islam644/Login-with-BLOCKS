import {
  Activity,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  KeyRound,
  Loader2,
  LogIn,
  Monitor,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";

import AppLayout from "@/components/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { useRoles } from "@/hooks/useRoles";
import { useOrganizations } from "@/hooks/useOrganizations";
import { cn } from "@/lib/utils";

function initialsFor(name, email) {
  const source = name || email || "";
  const parts = source.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function parseDeviceInfo(raw) {
  try {
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

function StatCard({ label, value, icon: Icon, description }) {
  return (
    <div className="group rounded-xl border bg-card p-4 transition-colors hover:bg-muted/20">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>

        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
      </div>

      <div className="mt-4">
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>

        {description && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function ActivityItem({ icon: Icon, title, value, description, last }) {
  return (
    <div className="relative flex gap-4">
      {!last && (
        <div className="absolute left-[18px] top-9 h-full w-px bg-border" />
      )}

      <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1 pb-6">
        <div className="flex flex-col justify-between gap-1 sm:flex-row">
          <p className="text-sm font-medium">{title}</p>

          <span className="text-xs text-muted-foreground">{value}</span>
        </div>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: profile, isLoading, isError } = useProfile();

  const { data: roles = [] } = useRoles();

  const { data: orgsResponse } = useOrganizations();

  const organizations = orgsResponse?.organizations ?? [];

  const fullName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(" ");

  const device = parseDeviceInfo(profile?.lastLoggedInDeviceInfo);

  const deviceName =
    device.Browser || device.OS
      ? `${device.Browser ?? "—"} on ${device.OS ?? "—"}`
      : "No device information";

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-7xl">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Overview
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                Welcome
                {fullName ? `, ${fullName}` : ""}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Here's what's happening with your BLOCKS account.
              </p>
            </div>

            {profile && (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  {profile.profileImageUrl && (
                    <AvatarImage
                      src={profile.profileImageUrl}
                      alt={fullName || "Profile"}
                    />
                  )}

                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initialsFor(fullName, profile.email)}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{fullName || "Account"}</p>

                  <p className="text-xs text-muted-foreground">
                    {profile.email || "BLOCKS account"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            LOADING
        ====================================================== */}
        {isLoading && (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border bg-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>

            <p className="mt-4 text-sm font-medium">Loading dashboard</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Fetching your account information…
            </p>
          </div>
        )}

        {/* =====================================================
            ERROR
        ====================================================== */}
        {isError && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.04] p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                <ShieldAlert className="h-4 w-4 text-destructive" />
              </div>

              <div>
                <p className="text-sm font-medium text-destructive">
                  Unable to load dashboard
                </p>

                <p className="mt-1 text-xs text-destructive/70">
                  We couldn't retrieve your dashboard data.
                </p>
              </div>
            </div>
          </div>
        )}

        {profile && (
          <div className="space-y-6">
            {/* =================================================
                ACCOUNT OVERVIEW
            ================================================== */}
            <section className="overflow-hidden rounded-2xl border bg-card">
              <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2">
                    {profile.profileImageUrl && (
                      <AvatarImage
                        src={profile.profileImageUrl}
                        alt={fullName || "Profile"}
                      />
                    )}

                    <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                      {initialsFor(fullName, profile.email)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">
                        {fullName || "Your account"}
                      </h2>

                      {profile.active && (
                        <Badge
                          variant="secondary"
                          className="gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          Active
                        </Badge>
                      )}

                      {profile.isVerified && (
                        <Badge
                          variant="secondary"
                          className="gap-1.5 rounded-full bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 dark:text-blue-400"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {profile.email ||
                        "You are logged in to your BLOCKS account."}
                    </p>
                  </div>
                </div>

                {/* Security Status */}
                <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      profile.mfaEnabled
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                    )}
                  >
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Account security
                    </p>

                    <p className="mt-0.5 text-sm font-medium">
                      {profile.mfaEnabled ? "MFA protected" : "MFA not enabled"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                STATISTICS
            ================================================== */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              <StatCard
                label="Total logins"
                value={profile.logInCount ?? "—"}
                icon={LogIn}
                description="Account activity"
              />

              <StatCard
                label="Roles"
                value={roles.length}
                icon={ShieldCheck}
                description="Assigned roles"
              />

              <StatCard
                label="Organizations"
                value={organizations.length}
                icon={Building2}
                description="Available organizations"
              />

              <StatCard
                label="Permissions"
                value={1}
                icon={KeyRound}
                description="Assigned permissions"
              />

              <StatCard
                label="MFA"
                value={profile.mfaEnabled ? "Enabled" : "Disabled"}
                icon={ShieldAlert}
                description="Security status"
              />
            </div>

            {/* =================================================
                MAIN CONTENT
            ================================================== */}
            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              {/* =================================================
                  ACTIVITY
              ================================================== */}
              <section className="rounded-2xl border bg-card">
                <div className="border-b px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Activity className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold">Recent activity</h2>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Your latest account activity
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 pt-6">
                  <ActivityItem
                    icon={LogIn}
                    title="Last login"
                    value={formatDate(profile.lastLoggedInTime)}
                    description="Most recent successful authentication"
                  />

                  <ActivityItem
                    icon={Monitor}
                    title="Last device"
                    value={device.Browser || device.OS || "—"}
                    description={deviceName}
                  />

                  <ActivityItem
                    icon={Clock3}
                    title="Login count"
                    value={profile.logInCount ?? "—"}
                    description="Total recorded account logins"
                    last
                  />
                </div>
              </section>

              {/* =================================================
                  ACCOUNT HEALTH
              ================================================== */}
              <section className="rounded-2xl border bg-card">
                <div className="border-b px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ShieldCheck className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold">
                        Account overview
                      </h2>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Current account status
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {/* Active */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />

                        <span className="text-sm">Account status</span>
                      </div>

                      <span className="text-sm font-medium">
                        {profile.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Verified */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />

                        <span className="text-sm">Verification</span>
                      </div>

                      <span className="text-sm font-medium">
                        {profile.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>

                    {/* MFA */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            profile.mfaEnabled
                              ? "bg-emerald-500"
                              : "bg-amber-500",
                          )}
                        />

                        <span className="text-sm">
                          Multi-factor authentication
                        </span>
                      </div>

                      <span className="text-sm font-medium">
                        {profile.mfaEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-6 border-t" />

                  {/* Organization */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        Organizations
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {organizations.length}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Organizations available to your account
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// import { Building2, KeyRound, Loader2, LogIn, ShieldAlert, ShieldCheck } from "lucide-react";
// import AppLayout from "@/components/AppLayout";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { useProfile } from "@/hooks/useProfile";
// import { useRoles } from "@/hooks/useRoles";
// import { useOrganizations } from "@/hooks/useOrganizations";

// function initialsFor(name, email) {
//   const source = name || email || "";
//   const parts = source.trim().split(/\s+/).filter(Boolean);
//   if (parts.length === 0) return "?";
//   if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
//   return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
// }

// function parseDeviceInfo(raw) {
//   try {
//     return JSON.parse(raw || "{}");
//   } catch {
//     return {};
//   }
// }

// function formatDate(iso) {
//   if (!iso) return "—";
//   return new Date(iso).toLocaleString();
// }

// function StatCard({ label, value, icon: Icon }) {
//   return (
//     <div className="rounded-xl border bg-card p-4">
//       <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
//         {Icon && <Icon className="h-4 w-4" />}
//         {label}
//       </div>
//       <div className="mt-1 text-2xl font-semibold">{value}</div>
//     </div>
//   );
// }

// export default function Dashboard() {
//   const { data: profile, isLoading, isError } = useProfile();
//   const { data: roles = [] } = useRoles();
//   const { data: orgsResponse } = useOrganizations();
//   const organizations = orgsResponse?.organizations ?? [];

//   const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ");
//   const device = parseDeviceInfo(profile?.lastLoggedInDeviceInfo);

//   return (
//     <AppLayout>
//       <div className="mx-auto max-w-2xl space-y-4">
//         <div className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm">
//           <Avatar className="h-14 w-14">
//             {profile?.profileImageUrl && <AvatarImage src={profile.profileImageUrl} />}
//             <AvatarFallback className="text-lg">
//               {initialsFor(fullName, profile?.email)}
//             </AvatarFallback>
//           </Avatar>

//           <div>
//             <h1 className="text-xl font-medium">
//               Welcome{fullName ? `, ${fullName}` : ""}
//             </h1>
//             <p className="mt-1 text-sm text-muted-foreground">
//               {profile?.email || "You are logged in to your Blocks dashboard."}
//             </p>
//           </div>

//           <div className="ml-auto flex flex-wrap justify-end gap-1.5">
//             {profile?.active && <Badge variant="secondary">Active</Badge>}
//             {profile?.isVerified && <Badge variant="secondary">Verified</Badge>}
//           </div>
//         </div>

//         {isLoading && (
//           <div className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-card p-10">
//             <Loader2 className="h-6 w-6 animate-spin text-primary" />
//             <p className="text-sm text-muted-foreground">Loading dashboard…</p>
//           </div>
//         )}

//         {isError && (
//           <div className="rounded-xl border bg-card p-5 text-sm text-destructive">
//             Failed to load dashboard data.
//           </div>
//         )}

//         {profile && (
//           <>
//             <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
//               <StatCard label="Logins" value={profile.logInCount ?? "—"} icon={LogIn} />
//               <StatCard label="Roles" value={roles.length} icon={ShieldCheck} />
//               <StatCard
//                 label="Organizations"
//                 value={organizations.length}
//                 icon={Building2}
//               />
//               <StatCard label="Permissions" value={1} icon={KeyRound} />
//               <StatCard
//                 label="MFA"
//                 value={profile.mfaEnabled ? "Enabled" : "Disabled"}
//                 icon={ShieldAlert}
//               />
//             </div>

//             <div className="rounded-xl border bg-card p-5">
//               <h2 className="mb-2 text-sm font-medium text-muted-foreground">
//                 Last activity
//               </h2>
//               <div className="flex items-center justify-between border-b py-3">
//                 <span className="text-sm text-muted-foreground">Last logged in</span>
//                 <span className="text-sm font-medium">
//                   {formatDate(profile.lastLoggedInTime)}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between py-3">
//                 <span className="text-sm text-muted-foreground">Device</span>
//                 <span className="text-sm font-medium">
//                   {device.Browser || device.OS
//                     ? `${device.Browser ?? "—"} on ${device.OS ?? "—"} (${device.Device ?? "—"})`
//                     : "—"}
//                 </span>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </AppLayout>
//   );
// }
