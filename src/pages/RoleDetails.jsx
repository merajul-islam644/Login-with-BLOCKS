import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRoles } from "@/hooks/useRoles";

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

export default function RoleDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: roles = [], isLoading, isError } = useRoles();
  const role = roles.find((r) => r.slug === slug);

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-4">
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {isLoading && (
          <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
            Loading role…
          </div>
        )}

        {isError && (
          <div className="rounded-xl border bg-card p-5 text-sm text-destructive">
            Failed to load role.
          </div>
        )}

        {!isLoading && !isError && !role && (
          <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
            Role "{slug}" not found.
          </div>
        )}

        {role && (
          <>
            <div className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm">
              <div>
                <h1 className="text-xl font-medium">{role.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{role.slug}</p>
              </div>

              <div className="ml-auto flex flex-wrap justify-end gap-1.5">
                {role.canCreateOwn && <Badge variant="secondary">Can create own</Badge>}
              </div>
            </div>

            {role.description && (
              <div className="rounded-xl border bg-card p-5">
                <h2 className="mb-2 text-sm font-medium text-muted-foreground">Description</h2>
                <p className="text-sm">{role.description}</p>
              </div>
            )}

            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">Details</h2>
              <InfoRow label="Item ID" value={role.itemId} />
              <InfoRow label="Users assigned" value={role.count} />
              <InfoRow label="Parent role" value={role.parentRoleSlug} />
              <InfoRow
                label="Ancestor roles"
                value={
                  role.ancestorRoleSlugs?.length ? role.ancestorRoleSlugs.join(", ") : "—"
                }
              />
              <InfoRow label="Can create own" value={role.canCreateOwn ? "Yes" : "No"} />
              <InfoRow
                label="Created from default"
                value={role.createdFromDefault ? "Yes" : "No"}
              />
              <InfoRow label="Language" value={role.language} />
              <InfoRow
                label="Tags"
                value={role.tags?.length ? role.tags.join(", ") : "—"}
              />
              <InfoRow label="Organization" value={role.organizationId} />
              <InfoRow label="Created by" value={role.createdBy} />
              <InfoRow label="Created" value={formatDate(role.createdDate)} />
              <InfoRow label="Last updated by" value={role.lastUpdatedBy} />
              <InfoRow label="Last updated" value={formatDate(role.lastUpdatedDate)} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
