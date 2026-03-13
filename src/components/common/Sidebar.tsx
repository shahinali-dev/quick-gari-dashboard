import type { MenuItem } from "@/components/common/NavItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import {
  Bell,
  Car,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
} from "lucide-react";
import NavItem from "./NavItem";

const mainMenu: MenuItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/", badge: null },
  { name: "Users", icon: Users, path: "/users", badge: null },
  {
    name: "Car Registration",
    icon: Car,
    path: "/car-registration",
    badge: null,
  },
  {
    name: "Cars",
    icon: Car,
    path: "/cars",
    badge: null,
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  // Dynamic secondary menu with unread count
  const secondaryMenu: MenuItem[] = [
    {
      name: "Notifications",
      icon: Bell,
      path: "/notifications",
      badge:
        unreadCount > 0 ? String(unreadCount > 9 ? "9+" : unreadCount) : null,
    },
  ];
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col h-screen bg-gray-950 text-gray-100 transition-all duration-300 ease-in-out shrink-0",
          collapsed ? "w-[68px]" : "w-64",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-16 px-3 gap-3 border-b border-gray-800",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500 shrink-0">
                <Car size={18} className="text-gray-950" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white truncate">
                Quick Gari
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 shrink-0"
          >
            {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto py-4 space-y-0.5",
            collapsed ? "px-0" : "px-2",
          )}
        >
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              Main
            </p>
          )}
          {mainMenu.map((item) => (
            <NavItem key={item.path} item={item} collapsed={collapsed} />
          ))}

          <Separator className="my-3 bg-gray-800" />

          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              System
            </p>
          )}
          {secondaryMenu.map((item) => (
            <NavItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-gray-800 p-3">
          <div
            className={cn(
              "flex items-center gap-3",
              collapsed && "justify-center",
            )}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-amber-500 text-gray-950 text-xs font-bold">
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "US"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            )}
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-7 w-7 text-gray-400 hover:text-white hover:bg-gray-800 shrink-0"
                title="Logout"
              >
                <LogOut size={14} />
              </Button>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
