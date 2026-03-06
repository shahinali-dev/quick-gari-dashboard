import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

export interface MenuItem {
  name: string;
  icon: LucideIcon;
  path: string;
  badge: string | null;
}

interface NavItemProps {
  item: MenuItem;
  collapsed: boolean;
}

export default function NavItem({ item, collapsed }: NavItemProps) {
  const Icon = item.icon;

  const link = (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) =>
        cn(
          "flex items-center rounded-lg text-sm font-medium transition-colors duration-150",
          isActive
            ? "bg-amber-500 text-gray-950"
            : "text-gray-400 hover:bg-gray-800 hover:text-white",
          collapsed ? "w-10 h-10 justify-center" : "gap-3 px-3 py-2 w-full",
        )
      }
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="truncate">{item.name}</span>}
      {!collapsed && item.badge && (
        <Badge className="ml-auto h-5 px-1.5 text-[10px] bg-amber-500/20 text-amber-400 border-0">
          {item.badge}
        </Badge>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild className="flex justify-center w-full">
          {link}
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.name}
          {item.badge && (
            <Badge className="h-4 px-1 text-[10px] bg-amber-500 text-gray-950 border-0">
              {item.badge}
            </Badge>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
