'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Wrench,
  LogOut,
  LayoutDashboard,
  Calendar,
  Settings,
  Users,
  BarChart3,
  ChevronDown,
  Factory,
  Folder,
  ClipboardList,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const nav = [
  { label: 'Maintenance', path: '/dashboard/maintenance', icon: ClipboardList },
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Calendar', path: '/dashboard/calendar', icon: Calendar },
  {
    label: 'Equipment',
    path: '/dashboard/equipment',
    icon: Settings,
    dropdown: true,
  },
  { label: 'Reporting', path: '/dashboard/reporting', icon: BarChart3 },
  { label: 'Teams', path: '/dashboard/teams', icon: Users },
  { label: 'Companies', path: '/dashboard/companies', icon: Building2 },
];

const equipmentMenu = [
  { label: 'Equipment', path: '/dashboard/equipment', icon: Settings },
  { label: 'Work Centers', path: '/dashboard/work-centers', icon: Factory },
  { label: 'Categories', path: '/dashboard/categories', icon: Folder },
];

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const isActive = (p: string) => {
    if (p === '/dashboard/equipment') {
      return [
        '/dashboard/equipment',
        '/dashboard/work-centers',
        '/dashboard/categories',
      ].includes(pathname);
    }
    return pathname === p;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary">
              <Wrench className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:block">GearGuard</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">
                {session?.data?.user?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">
                {session?.data?.user?.email}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <nav className="px-4 pb-2 flex gap-1 overflow-x-auto">
          {nav.map(item =>
            item.dropdown ? (
              <DropdownMenu key={item.path}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1 ${isActive(item.path) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                  >
                    {item.label}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {equipmentMenu.map(sub => (
                    <DropdownMenuItem
                      key={sub.path}
                      onClick={() => router.push(sub.path)}
                      className="gap-2"
                    >
                      <sub.icon className="h-4 w-4" />
                      {sub.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap ${isActive(item.path) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
              >
                {item.label}
              </button>
            )
          )}
        </nav>
      </header>
      <main className="flex-1 p-3 md:p-5">{children}</main>
    </div>
  );
}
