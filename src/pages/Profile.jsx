import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Languages,
  Building2,
  ShieldCheck,
  Activity,
  LogIn,
  Monitor,
  CalendarDays,
  Clock3,
  Mail,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";

import AppLayout from "@/components/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";

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

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 truncate text-sm font-medium">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function ActivityItem({ icon: Icon, title, value, description }) {
  return (
    <div className="relative flex gap-4">
      <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1 pb-6">
        <div className="flex flex-col justify-between gap-1 sm:flex-row">
          <p className="text-sm font-medium">{title}</p>

          <p className="text-xs text-muted-foreground">{value}</p>
        </div>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useProfile();

  const fullName = [profile?.salutation, profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(" ");

  const device = parseDeviceInfo(profile?.lastLoggedInDeviceInfo);

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-6xl">
        {/* =====================================================
            TOP BAR
        ====================================================== */}
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="text-right">
            <h1 className="text-lg font-semibold tracking-tight">Profile</h1>

            <p className="text-xs text-muted-foreground">Account information</p>
          </div>
        </div>

        {/* =====================================================
            LOADING
        ====================================================== */}
        {isLoading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
              Loading profile…
            </div>
          </div>
        )}

        {/* =====================================================
            ERROR
        ====================================================== */}
        {isError && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-destructive" />

              <div>
                <p className="text-sm font-medium text-destructive">
                  Failed to load profile
                </p>

                <p className="mt-1 text-xs text-destructive/70">
                  Please try again later.
                </p>
              </div>
            </div>
          </div>
        )}

        {profile && (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            {/* =================================================
                LEFT PROFILE PANEL
            ================================================== */}
            <aside className="relative overflow-hidden rounded-2xl border bg-card">
              {/* Decorative Header */}
              <div className="h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />

              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="-mt-10">
                  <Avatar className="h-20 w-20 border-4 border-card shadow-md">
                    {profile.profileImageUrl && (
                      <AvatarImage
                        src={profile.profileImageUrl}
                        alt={fullName || "Profile"}
                      />
                    )}

                    <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                      {initialsFor(fullName, profile.email)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Identity */}
                <div className="mt-4">
                  <h2 className="text-xl font-semibold tracking-tight">
                    {fullName || "Account"}
                  </h2>

                  {profile.email && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="mt-5 flex flex-wrap gap-2">
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
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified
                    </Badge>
                  )}

                  {profile.mfaEnabled && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 rounded-full bg-violet-500/10 text-violet-600 hover:bg-violet-500/10 dark:text-violet-400"
                    >
                      <LockKeyhole className="h-3.5 w-3.5" />
                      MFA
                    </Badge>
                  )}
                </div>

                {/* Divider */}
                <div className="my-6 border-t" />

                {/* Account Summary */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">
                      Organization
                    </span>

                    <span className="max-w-[150px] truncate text-xs font-medium">
                      {profile.organizationId || "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">
                      Language
                    </span>

                    <span className="text-xs font-medium">
                      {profile.language || "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">
                      Login count
                    </span>

                    <span className="text-xs font-medium">
                      {profile.logInCount ?? "—"}
                    </span>
                  </div>
                </div>

                {/* Security */}
                <div className="mt-6 rounded-xl bg-muted/50 p-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />

                    <div>
                      <p className="text-xs font-semibold">Account Security</p>

                      <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                        Your account is protected with modern authentication and
                        security controls.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* =================================================
                RIGHT CONTENT
            ================================================== */}
            <main className="space-y-6">
              {/* Account Information */}
              <section className="rounded-2xl border bg-card">
                <div className="border-b px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold">
                        Personal information
                      </h2>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Your account and organization details
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid divide-y px-6 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
                  <div className="sm:pr-6">
                    <DetailItem
                      icon={User}
                      label="First name"
                      value={profile.firstName}
                    />

                    <DetailItem
                      icon={User}
                      label="Last name"
                      value={profile.lastName}
                    />

                    <DetailItem
                      icon={Phone}
                      label="Phone number"
                      value={profile.phoneNumber}
                    />
                  </div>

                  <div className="sm:pl-6">
                    <DetailItem
                      icon={Languages}
                      label="Language"
                      value={profile.language}
                    />

                    <DetailItem
                      icon={Building2}
                      label="Organization"
                      value={profile.organizationId}
                    />

                    <DetailItem
                      icon={ShieldCheck}
                      label="Roles"
                      value={
                        profile.roles?.length ? profile.roles.join(", ") : "—"
                      }
                    />
                  </div>
                </div>
              </section>

              {/* Activity */}
              <section className="rounded-2xl border bg-card">
                <div className="border-b px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Activity className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold">
                        Account activity
                      </h2>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Recent authentication and account events
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 pt-5">
                  <ActivityItem
                    icon={LogIn}
                    title="Login activity"
                    value={profile.logInCount ?? "—"}
                    description={`${profile.logInCount ?? "—"} total login attempts`}
                  />

                  <ActivityItem
                    icon={Clock3}
                    title="Last logged in"
                    value={formatDate(profile.lastLoggedInTime)}
                    description="Most recent successful authentication"
                  />

                  <ActivityItem
                    icon={Monitor}
                    title="Last device"
                    value={
                      device.Browser || device.OS
                        ? `${device.Browser ?? "—"}`
                        : "—"
                    }
                    description={
                      device.Browser || device.OS
                        ? `${device.OS ?? "—"} • ${device.Device ?? "—"}`
                        : "No device information available"
                    }
                  />

                  <ActivityItem
                    icon={CalendarDays}
                    title="Account created"
                    value={formatDate(profile.createdDate)}
                    description="Date this account was created"
                  />

                  <div className="relative flex gap-4">
                    <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1 pb-5">
                      <div className="flex flex-col justify-between gap-1 sm:flex-row">
                        <p className="text-sm font-medium">Last updated</p>

                        <p className="text-xs text-muted-foreground">
                          {formatDate(profile.lastUpdatedDate)}
                        </p>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Most recent profile update
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// import { useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
// import AppLayout from "@/components/AppLayout";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { useProfile } from "@/hooks/useProfile";

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

// function InfoRow({ label, value }) {
//   return (
//     <div className="flex items-center justify-between border-b py-3 last:border-b-0">
//       <span className="text-sm text-muted-foreground">{label}</span>
//       <span className="text-sm font-medium">{value ?? "—"}</span>
//     </div>
//   );
// }

// export default function Profile() {
//   const navigate = useNavigate();
//   const { data: profile, isLoading, isError } = useProfile();

//   const fullName = [profile?.salutation, profile?.firstName, profile?.lastName]
//     .filter(Boolean)
//     .join(" ");
//   const device = parseDeviceInfo(profile?.lastLoggedInDeviceInfo);

//   return (
//     <AppLayout>
//       <div className="mx-auto max-w-2xl">
//         <div className="mb-6 flex items-center justify-between">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="gap-1.5"
//             onClick={() => navigate(-1)}
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back
//           </Button>

//           <h1 className="text-xl font-medium">Profile</h1>
//         </div>

//         {isLoading && (
//           <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
//             Loading profile…
//           </div>
//         )}

//         {isError && (
//           <div className="rounded-xl border bg-card p-5 text-sm text-destructive">
//             Failed to load profile.
//           </div>
//         )}

//         {profile && (
//           <div className="space-y-4">
//             <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
//               <Avatar className="h-14 w-14">
//                 {profile.profileImageUrl && (
//                   <AvatarImage src={profile.profileImageUrl} />
//                 )}
//                 <AvatarFallback className="text-base">
//                   {initialsFor(fullName, profile.email)}
//                 </AvatarFallback>
//               </Avatar>

//               <div>
//                 <div className="font-medium">{fullName || "Account"}</div>
//                 {profile.email && (
//                   <div className="mt-0.5 text-sm text-muted-foreground">
//                     {profile.email}
//                   </div>
//                 )}
//               </div>

//               <div className="ml-auto flex flex-wrap justify-end gap-1.5">
//                 {profile.active && <Badge variant="secondary">Active</Badge>}
//                 {profile.isVerified && (
//                   <Badge variant="secondary">Verified</Badge>
//                 )}
//                 {profile.mfaEnabled && (
//                   <Badge variant="secondary">MFA Enabled</Badge>
//                 )}
//               </div>
//             </div>

//             <div className="rounded-xl border bg-card p-5">
//               <h2 className="mb-2 text-sm font-medium text-muted-foreground">
//                 Account details
//               </h2>
//               <InfoRow label="First name" value={profile.firstName} />
//               <InfoRow label="Last name" value={profile.lastName} />
//               <InfoRow label="Phone number" value={profile.phoneNumber} />
//               <InfoRow label="Language" value={profile.language} />
//               <InfoRow label="Organization" value={profile.organizationId} />
//               <InfoRow
//                 label="Roles"
//                 value={profile.roles?.length ? profile.roles.join(", ") : "—"}
//               />
//             </div>

//             <div className="rounded-xl border bg-card p-5">
//               <h2 className="mb-2 text-sm font-medium text-muted-foreground">
//                 Activity
//               </h2>
//               <InfoRow label="Login count" value={profile.logInCount} />
//               <InfoRow
//                 label="Last logged in"
//                 value={formatDate(profile.lastLoggedInTime)}
//               />
//               <InfoRow
//                 label="Last device"
//                 value={
//                   device.Browser || device.OS
//                     ? `${device.Browser ?? "—"} on ${device.OS ?? "—"} (${device.Device ?? "—"})`
//                     : "—"
//                 }
//               />
//               <InfoRow
//                 label="Created"
//                 value={formatDate(profile.createdDate)}
//               />
//               <InfoRow
//                 label="Last updated"
//                 value={formatDate(profile.lastUpdatedDate)}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </AppLayout>
//   );
// }
