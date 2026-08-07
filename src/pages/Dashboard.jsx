import { Building2, KeyRound, Loader2, LogIn, ShieldAlert, ShieldCheck } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { useRoles } from "@/hooks/useRoles";
import { useOrganizations } from "@/hooks/useOrganizations";

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

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const { data: profile, isLoading, isError } = useProfile();
  const { data: roles = [] } = useRoles();
  const { data: orgsResponse } = useOrganizations();
  const organizations = orgsResponse?.organizations ?? [];

  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ");
  const device = parseDeviceInfo(profile?.lastLoggedInDeviceInfo);

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm">
          <Avatar className="h-14 w-14">
            {profile?.profileImageUrl && <AvatarImage src={profile.profileImageUrl} />}
            <AvatarFallback className="text-lg">
              {initialsFor(fullName, profile?.email)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-xl font-medium">
              Welcome{fullName ? `, ${fullName}` : ""}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile?.email || "You are logged in to your Blocks dashboard."}
            </p>
          </div>

          <div className="ml-auto flex flex-wrap justify-end gap-1.5">
            {profile?.active && <Badge variant="secondary">Active</Badge>}
            {profile?.isVerified && <Badge variant="secondary">Verified</Badge>}
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-card p-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading dashboard…</p>
          </div>
        )}

        {isError && (
          <div className="rounded-xl border bg-card p-5 text-sm text-destructive">
            Failed to load dashboard data.
          </div>
        )}

        {profile && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <StatCard label="Logins" value={profile.logInCount ?? "—"} icon={LogIn} />
              <StatCard label="Roles" value={roles.length} icon={ShieldCheck} />
              <StatCard
                label="Organizations"
                value={organizations.length}
                icon={Building2}
              />
              <StatCard label="Permissions" value={1} icon={KeyRound} />
              <StatCard
                label="MFA"
                value={profile.mfaEnabled ? "Enabled" : "Disabled"}
                icon={ShieldAlert}
              />
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">
                Last activity
              </h2>
              <div className="flex items-center justify-between border-b py-3">
                <span className="text-sm text-muted-foreground">Last logged in</span>
                <span className="text-sm font-medium">
                  {formatDate(profile.lastLoggedInTime)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">Device</span>
                <span className="text-sm font-medium">
                  {device.Browser || device.OS
                    ? `${device.Browser ?? "—"} on ${device.OS ?? "—"} (${device.Device ?? "—"})`
                    : "—"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
