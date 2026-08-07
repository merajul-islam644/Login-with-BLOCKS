import { useNavigate } from "react-router-dom";
import {
  Building2,
  KeyRound,
  Languages as LanguagesIcon,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Notification from "@/notification/Notification";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useLanguages } from "@/hooks/useLanguages";
import { useRoles } from "@/hooks/useRoles";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

function initialsFor(name, email) {
  const source = name || email || "";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const TopBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { data: languages = [] } = useLanguages();
  const currentLanguage =
    languages.find((l) => l.languageCode === language) ??
    languages.find((l) => l.isDefault) ??
    null;
  const { data: roles = [] } = useRoles();
  const { data: orgsResponse } = useOrganizations();
  const organizations = orgsResponse?.organizations ?? [];
  const orgErrorMessage = !orgsResponse?.isSuccess
    ? Object.values(orgsResponse?.errors ?? {})[0]
    : null;
  const { data: userDetails } = useUserPermissions();
  const permissions = userDetails?.permissions ?? [];
  const { data: profile } = useProfile();
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ");

  return (
    <header className="sticky top-0 z-40 flex h-15 items-center border-b bg-background px-6">
      <div className="font-medium">Blocks</div>

      <div className="ml-auto flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label={`Language: ${currentLanguage?.languageName ?? "Select language"}`}
            >
              <LanguagesIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.itemId}
                onClick={() => setLanguage(lang.languageCode)}
                className={cn(
                  "justify-between",
                  lang.languageCode === currentLanguage?.languageCode && "font-medium"
                )}
              >
                {lang.languageName}
                {lang.isDefault && (
                  <Badge variant="secondary" className="ml-2">
                    Default
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1.5 rounded-full">
              <ShieldCheck className="h-5 w-5" />
              Roles
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            {roles.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">No roles found</div>
            )}
            {roles.map((role) => (
              <DropdownMenuItem
                key={role.itemId}
                className="flex-col items-start gap-0.5"
                onClick={() => navigate(`/roles/${role.slug}`)}
              >
                <span className="font-medium">{role.name}</span>
                {role.description && (
                  <span className="text-xs text-muted-foreground">{role.description}</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1.5 rounded-full">
              <KeyRound className="h-5 w-5" />
              Permissions
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            {permissions.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No permissions found
              </div>
            )}
            {permissions.map((permission) => (
              <DropdownMenuItem
                key={permission}
                onClick={() => navigate(`/permissions/${encodeURIComponent(permission)}`)}
              >
                {permission}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1.5 rounded-full">
              <Building2 className="h-5 w-5" />
              Organizations
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-72">
            {orgErrorMessage && (
              <div className="px-3 py-2 text-sm text-muted-foreground">{orgErrorMessage}</div>
            )}
            {!orgErrorMessage && organizations.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No organizations found
              </div>
            )}
            {organizations.map((org) => (
              <DropdownMenuItem
                key={org.itemId}
                className="flex-col items-start gap-0.5"
                onClick={() => navigate(`/organizations/${org.itemId}`)}
              >
                <span className="font-medium">{org.name}</span>
                {org.description && (
                  <span className="text-xs text-muted-foreground">{org.description}</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
        >
          {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Notification />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-full p-1 transition hover:bg-muted">
              <Avatar className="h-10 w-10">
                {profile?.profileImageUrl && <AvatarImage src={profile.profileImageUrl} />}
                <AvatarFallback>{initialsFor(fullName, profile?.email)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="font-medium">{fullName || "Account"}</p>
              {profile?.email && (
                <p className="text-xs text-muted-foreground">{profile.email}</p>
              )}
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User />
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={logout}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
