import TopBar from "@/topbar/TopBar";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar />
      <SidebarProvider>
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
