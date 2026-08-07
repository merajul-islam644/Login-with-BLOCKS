import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value ?? "—"}</span>
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
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <h1 className="text-xl font-medium">Profile</h1>
        </div>

        {isLoading && (
          <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
            Loading profile…
          </div>
        )}

        {isError && (
          <div className="rounded-xl border bg-card p-5 text-sm text-destructive">
            Failed to load profile.
          </div>
        )}

        {profile && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
              <Avatar className="h-14 w-14">
                {profile.profileImageUrl && <AvatarImage src={profile.profileImageUrl} />}
                <AvatarFallback className="text-base">
                  {initialsFor(fullName, profile.email)}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="font-medium">{fullName || "Account"}</div>
                {profile.email && (
                  <div className="mt-0.5 text-sm text-muted-foreground">{profile.email}</div>
                )}
              </div>

              <div className="ml-auto flex flex-wrap justify-end gap-1.5">
                {profile.active && <Badge variant="secondary">Active</Badge>}
                {profile.isVerified && <Badge variant="secondary">Verified</Badge>}
                {profile.mfaEnabled && <Badge variant="secondary">MFA Enabled</Badge>}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">
                Account details
              </h2>
              <InfoRow label="First name" value={profile.firstName} />
              <InfoRow label="Last name" value={profile.lastName} />
              <InfoRow label="Phone number" value={profile.phoneNumber} />
              <InfoRow label="Language" value={profile.language} />
              <InfoRow label="Organization" value={profile.organizationId} />
              <InfoRow
                label="Roles"
                value={profile.roles?.length ? profile.roles.join(", ") : "—"}
              />
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">
                Activity
              </h2>
              <InfoRow label="Login count" value={profile.logInCount} />
              <InfoRow label="Last logged in" value={formatDate(profile.lastLoggedInTime)} />
              <InfoRow
                label="Last device"
                value={
                  device.Browser || device.OS
                    ? `${device.Browser ?? "—"} on ${device.OS ?? "—"} (${device.Device ?? "—"})`
                    : "—"
                }
              />
              <InfoRow label="Created" value={formatDate(profile.createdDate)} />
              <InfoRow label="Last updated" value={formatDate(profile.lastUpdatedDate)} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
