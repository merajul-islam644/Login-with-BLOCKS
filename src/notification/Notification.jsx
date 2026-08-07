import { useNavigate } from "react-router-dom";
import { Bell, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

const Notification = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useNotifications();
  const notifications = data?.configurations ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-full p-2 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <Bell className="h-5 w-5" />

          {notifications.length > 0 && (
            <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-96 overflow-hidden rounded-xl p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-base font-semibold">Notifications</h3>

          <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            {notifications.length}
          </span>
        </div>

        {/* Notification List */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          )}

          {!isLoading && notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.itemId}
                className="flex cursor-pointer items-start gap-3 px-4 py-4 transition-colors hover:bg-muted"
                onClick={() => navigate(`/notifications/${notification.itemId}`)}
              >
                <div className="rounded-full bg-primary/10 p-2">
                  <Bell className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1">
                  <p className="font-medium">{notification.name}</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.notifyMethod}
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDate(notification.createdDate)}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            !isLoading && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            )
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Footer */}
        <DropdownMenuItem className="justify-center py-3 font-medium text-primary hover:bg-muted">
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
