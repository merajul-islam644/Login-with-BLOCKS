import TopBar from "@/topbar/TopBar";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen">
      <TopBar />
      <SidebarProvider>
        <div className="flex">
          <AppSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
