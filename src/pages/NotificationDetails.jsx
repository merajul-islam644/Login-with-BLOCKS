import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";

const CHANNELS = { 0: "In-app" };
const TYPES = { 0: "System" };

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

export default function NotificationDetails() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useNotifications();
  const notification = data?.configurations?.find((n) => n.itemId === itemId);

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-4">
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {isLoading && (
          <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
            Loading notification…
          </div>
        )}

        {isError && (
          <div className="rounded-xl border bg-card p-5 text-sm text-destructive">
            Failed to load notification.
          </div>
        )}

        {!isLoading && !isError && !notification && (
          <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
            Notification not found.
          </div>
        )}

        {notification && (
          <>
            <div className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bell className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-xl font-medium">{notification.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {notification.notifyMethod}
                </p>
              </div>

              <div className="ml-auto">
                {notification.enablePersistence && (
                  <Badge variant="secondary">Persistent</Badge>
                )}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">Details</h2>
              <InfoRow
                label="Channel"
                value={CHANNELS[notification.channelToNotify] ?? notification.channelToNotify}
              />
              <InfoRow
                label="Type"
                value={TYPES[notification.notificationType] ?? notification.notificationType}
              />
              <InfoRow label="Notify method" value={notification.notifyMethod} />
              <InfoRow
                label="Persistence"
                value={notification.enablePersistence ? "Enabled" : "Disabled"}
              />
              <InfoRow label="Organization" value={notification.organizationId} />
              <InfoRow
                label="Tags"
                value={notification.tags?.length ? notification.tags.join(", ") : "—"}
              />
              <InfoRow label="Created by" value={notification.createdBy} />
              <InfoRow label="Created" value={formatDate(notification.createdDate)} />
              <InfoRow label="Last updated by" value={notification.lastUpdatedBy} />
              <InfoRow label="Last updated" value={formatDate(notification.lastUpdatedDate)} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
