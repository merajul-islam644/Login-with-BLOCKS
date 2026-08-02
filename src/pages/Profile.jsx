import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function initialsFor(name, email) {
  const source = name || email || "";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Profile() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-xl font-medium">Profile</h1>

        <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
          <Avatar className="h-14 w-14">
            {user?.picture && <AvatarImage src={user.picture} />}
            <AvatarFallback className="text-base">
              {initialsFor(user?.name, user?.email)}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="font-medium">{user?.name || "Account"}</div>
            {user?.email && (
              <div className="mt-0.5 text-sm text-muted-foreground">{user.email}</div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
