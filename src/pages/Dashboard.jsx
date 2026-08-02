import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/AppLayout";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm">
          {user?.picture ? (
            <img
              src={user.picture}
              alt=""
              className="h-14 w-14 rounded-full object-cover ring-2 ring-border"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-xl font-medium">
              Welcome{user?.name ? `, ${user.name}` : ""}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.email || "You are logged in to your Blocks dashboard."}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
