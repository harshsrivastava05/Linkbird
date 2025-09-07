'use client';
import { Sidebar } from "@/components/layout/sidebar";
import { useSidebarStore } from "@/store/sidebar-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebarStore();
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={`transition-all duration-300 ${
        isCollapsed ? "ml-20" : "ml-64"
      } min-h-screen overflow-y-auto`}>
        <div className="p-8 min-h-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}