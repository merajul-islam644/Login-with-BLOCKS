import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrganizations } from "@/hooks/useOrganizations";

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

export default function OrganizationDetails() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { data: orgsResponse, isLoading, isError } = useOrganizations();
  const organizations = orgsResponse?.organizations ?? [];
  const org = organizations.find((o) => o.itemId === itemId);

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-4">
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {isLoading && (
          <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
            Loading organization…
          </div>
        )}

        {isError && (
          <div className="rounded-xl border bg-card p-5 text-sm text-destructive">
            Failed to load organization.
          </div>
        )}

        {!isLoading && !isError && !org && (
          <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
            Organization not found.
          </div>
        )}

        {org && (
          <>
            <div className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm">
              {org.logoUrl ? (
                <img
                  src={org.logoUrl}
                  alt=""
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-border"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                  {org.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
              )}

              <div>
                <h1 className="text-xl font-medium">{org.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{org.itemId}</p>
              </div>

              <div className="ml-auto flex flex-wrap justify-end gap-1.5">
                {org.isDisabled ? (
                  <Badge variant="outline">Disabled</Badge>
                ) : (
                  <Badge variant="secondary">Active</Badge>
                )}
              </div>
            </div>

            {org.description && (
              <div className="rounded-xl border bg-card p-5">
                <h2 className="mb-2 text-sm font-medium text-muted-foreground">Description</h2>
                <p className="text-sm">{org.description}</p>
              </div>
            )}

            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">
                General
              </h2>
              <InfoRow label="Parent organization" value={org.parentOrganizationId} />
              <InfoRow label="Short code" value={org.shortCode} />
              <InfoRow label="Industry" value={org.industry} />
              <InfoRow label="Email" value={org.email} />
              <InfoRow label="Phone number" value={org.phoneNumber} />
              <InfoRow label="Website" value={org.websiteUrl} />
              <InfoRow label="Theme" value={org.theme} />
              <InfoRow
                label="Addresses"
                value={org.addresses?.length ? org.addresses.join(", ") : "—"}
              />
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">
                Localization
              </h2>
              <InfoRow label="Locale" value={org.locale} />
              <InfoRow label="Language" value={org.language} />
              <InfoRow label="Time zone" value={org.timeZone} />
              <InfoRow label="Date format" value={org.dateFormat} />
              <InfoRow label="Time format" value={org.timeFormat} />
              <InfoRow label="Currency" value={org.currency} />
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">
                Membership defaults
              </h2>
              <InfoRow
                label="Default roles for members"
                value={
                  org.defaultRoleForMembers?.length
                    ? org.defaultRoleForMembers.join(", ")
                    : "—"
                }
              />
              <InfoRow
                label="Default permissions for members"
                value={
                  org.defaultPermissionsForMembers?.length
                    ? org.defaultPermissionsForMembers.join(", ")
                    : "—"
                }
              />
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">Metadata</h2>
              <InfoRow label="Organization ID" value={org.organizationId} />
              <InfoRow
                label="Tags"
                value={org.tags?.length ? org.tags.join(", ") : "—"}
              />
              <InfoRow label="Created by" value={org.createdBy} />
              <InfoRow label="Created" value={formatDate(org.createdDate)} />
              <InfoRow label="Last updated by" value={org.lastUpdatedBy} />
              <InfoRow label="Last updated" value={formatDate(org.lastUpdatedDate)} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
