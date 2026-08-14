import { LayoutDashboard, Settings, Kanban } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useProfile } from "@/hooks/useProfile";
import { useRoles } from "@/hooks/useRoles";

const items = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Boardview", to: "/boardview", icon: Kanban },
  { label: "Settings", to: "/settings", icon: Settings },
];

function initialsFor(name, email) {
  const source = name || email || "";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed } = useSidebar();
  const { data: profile } = useProfile();
  const { data: roles = [] } = useRoles();
  const fullName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(" ");
  const roleName = roles[0]?.name || "Member";

  return (
    <Sidebar>
      <div className="flex h-12 items-center justify-between px-2">
        {!collapsed && (
          <span className="text-sm font-semibold text-muted-foreground/80 blur-[0.2px]">
            Navigation
          </span>
        )}
        <Tooltip>
          <TooltipTrigger render={<SidebarTrigger />} />
          <TooltipContent>
            {collapsed ? "Expand sidebar" : "Collapse sidebar"}
          </TooltipContent>
        </Tooltip>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.to}>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <SidebarMenuButton
                        isActive={location.pathname === item.to}
                        onClick={() => navigate(item.to)}
                      >
                        <item.icon />
                        {item.label}
                      </SidebarMenuButton>
                    }
                  />
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {(() => {
        const profileButton = (
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className={`m-2 flex items-center gap-3 rounded bg-muted p-2.5 text-left transition hover:bg-muted/70 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Avatar className="h-9 w-9 shrink-0">
              {profile?.profileImageUrl && (
                <AvatarImage src={profile.profileImageUrl} />
              )}
              <AvatarFallback>
                {initialsFor(fullName, profile?.email)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {fullName || "Account"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {roleName}
                </p>
              </div>
            )}
          </button>
        );

        if (!collapsed) return profileButton;

        return (
          <Tooltip>
            <TooltipTrigger render={profileButton} />
            <TooltipContent side="right">
              {fullName || "Account"}
            </TooltipContent>
          </Tooltip>
        );
      })()}
    </Sidebar>
  );
}
