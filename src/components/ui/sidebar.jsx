import { createContext, useContext, useState } from "react";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils"

const SidebarContext = createContext(null);

function SidebarProvider({ children, defaultCollapsed = false }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const toggleCollapsed = () => setCollapsed((c) => !c);

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar() must be used within a <SidebarProvider>.");
  }
  return ctx;
}

function Sidebar({ className, ...props }) {
  const { collapsed } = useSidebar();

  return (
    <aside
      data-slot="sidebar"
      data-collapsed={collapsed}
      className={cn(
        "sticky top-15 flex h-[calc(100vh-3.75rem)] w-56 shrink-0 flex-col border-r bg-background transition-[width] duration-200",
        collapsed && "w-16",
        className
      )}
      {...props} />
  );
}

function SidebarContent({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex flex-1 flex-col gap-1 overflow-auto p-3", className)}
      {...props} />
  );
}

function SidebarGroup({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("flex flex-col gap-1", className)}
      {...props} />
  );
}

function SidebarMenu({ className, ...props }) {
  return (
    <nav
      data-slot="sidebar-menu"
      className={cn("flex flex-col gap-1", className)}
      {...props} />
  );
}

function SidebarMenuItem({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-menu-item"
      className={cn("flex flex-col", className)}
      {...props} />
  );
}

function SidebarMenuButton({ className, isActive, title, children, ...props }) {
  const { collapsed } = useSidebar();

  return (
    <button
      data-slot="sidebar-menu-button"
      data-active={isActive}
      title={collapsed ? title : undefined}
      className={cn(
        "flex h-9 items-center gap-2.5 rounded-lg px-3 text-left text-sm font-medium text-muted-foreground transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-4 [&_svg]:shrink-0",
        "data-[active=true]:bg-primary/10 data-[active=true]:text-primary",
        collapsed && "justify-center px-0",
        className
      )}
      {...props}
    >
      {collapsed
        ? Array.isArray(children)
          ? children[0]
          : children
        : children}
    </button>
  );
}

function SidebarTrigger({ className, ...props }) {
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    <button
      data-slot="sidebar-trigger"
      onClick={toggleCollapsed}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
    </button>
  );
}

export {
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
}
