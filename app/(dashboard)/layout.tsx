// app/(dashboard)/layout.tsx
'use client'; // <-- Make it a client component
import { Sidebar } from "@/components/layout/sidebar";
import { useSidebarStore } from "@/store/sidebar-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebarStore();
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={`flex-1 p-8 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-10"}`}>
        {children}
      </main>
    </div>
  );
}