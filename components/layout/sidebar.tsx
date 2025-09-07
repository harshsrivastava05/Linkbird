"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  MessageSquare,
  Settings,
  User,
  ChevronLeft,
  Link2,
  FileText,
  Users2,
} from "lucide-react";
import { useSidebarStore } from "@/store/sidebar-store";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { LogoutButton } from "../auth/logout-button";

// Expanded list of navigation links
const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/campaigns", label: "Campaigns", icon: GitBranch },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/linkedin-accounts", label: "LinkedIn Accounts", icon: Link2 },
  { href: "/settings", label: "Settings & Billing", icon: Settings },
  { href: "/admin-panel", label: "Admin Panel", icon: User },
  { href: "/activity-logs", label: "Activity logs", icon: FileText },
  { href: "/user-logs", label: "User logs", icon: Users2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 z-40 h-screen flex flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-6 shrink-0">
        <Link href="/" className="text-lg font-bold">
          <span className="font-bold text-lg">
            {isCollapsed ? (
              <>
                L<span className="text-blue-500">B</span>
              </>
            ) : (
              <>
                Link<span className="text-blue-500">Bird</span>
              </>
            )}
          </span>
        </Link>
        <Button onClick={toggleSidebar} variant="ghost" size="icon">
          <ChevronLeft
            className={clsx(
              "h-4 w-4 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <nav className="space-y-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-primary",
                pathname === link.href && "bg-accent text-primary",
                isCollapsed && "justify-center"
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Fixed Footer Section */}
      <div className="border-t p-4 shrink-0 bg-background">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {session?.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{session?.user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user?.email}
              </p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <div className="mt-4">
            <LogoutButton />
          </div>
        )}
      </div>
    </aside>
  );
}