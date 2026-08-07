import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, KeyRound } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserPermissions } from "@/hooks/useUserPermissions";

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value ?? "—"}</span>
    </div>
  );
}

export default function PermissionDetails() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { data: userDetails, isLoading, isError } = useUserPermissions();

  const permissionName = decodeURIComponent(name);
  const hasPermission = userDetails?.permissions?.includes(permissionName);

  const orgsPermissions = userDetails?.OrganizationsPermissions ?? {};
  const orgsRoles = userDetails?.OrganizationsRoles ?? {};

  const grantingOrgIds = Object.entries(orgsPermissions)
    .filter(([, perms]) => perms.includes(permissionName))
    .map(([orgId]) => orgId);

  const grantingRoles = [...new Set(grantingOrgIds.flatMap((orgId) => orgsRoles[orgId] ?? []))];

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-4">
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {isLoading && (
          <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
            Loading permission…
          </div>
        )}

        {isError && (
          <div className="rounded-xl border bg-card p-5 text-sm text-destructive">
            Failed to load permission.
          </div>
        )}

        {!isLoading && !isError && !hasPermission && (
          <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
            Permission "{permissionName}" not found.
          </div>
        )}

        {hasPermission && (
          <>
            <div className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <KeyRound className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-xl font-medium">{permissionName}</h1>
                <p className="mt-1 text-sm text-muted-foreground">Granted permission</p>
              </div>

              <div className="ml-auto">
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">Details</h2>
              <InfoRow
                label="Organizations"
                value={grantingOrgIds.length ? grantingOrgIds.join(", ") : "—"}
              />
              <InfoRow
                label="Granted via roles"
                value={grantingRoles.length ? grantingRoles.join(", ") : "—"}
              />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
