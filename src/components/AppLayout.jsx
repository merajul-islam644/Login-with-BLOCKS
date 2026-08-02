import TopBar from "@/topbar/TopBar";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="p-6">{children}</main>
    </div>
  );
}
