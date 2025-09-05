// components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  GitBranch,
  MessageSquare,
  Settings,
  User,
  ChevronLeft,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebar-store';
import { useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import { LogoutButton } from '../auth/logout-button';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/campaigns', label: 'Campaigns', icon: GitBranch },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { data: session } = useSession();
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  return (
    <div className="relative">
      <aside
        className={`hidden flex-col border-r bg-gray-50 transition-all duration-300 md:flex ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="text-lg font-bold">
            {isCollapsed ? 'LB' : 'LinkBird'}
          </Link>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 transition-all hover:bg-gray-100"
            >
              <link.icon className="h-4 w-4" />
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-4">
            <User className="h-8 w-8 rounded-full" />
            {!isCollapsed && (
              <div>
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
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
      <Button
        onClick={toggleSidebar}
        variant="outline"
        size="icon"
        className="absolute -right-5 top-1/2 z-10 h-10 w-10 rounded-full"
      >
        <ChevronLeft
          className={`h-4 w-4 transition-transform ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        />
      </Button>
    </div>
  );
}