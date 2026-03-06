import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 gap-4 shrink-0">
      <div className="flex-1">
        <p className="text-sm text-gray-400">Welcome back 👋</p>
        <h2 className="text-base font-semibold text-gray-900 leading-tight">
          Quick Gari Admin
        </h2>
      </div>
      <Button variant="outline" size="icon" className="relative">
        <Bell size={16} />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-[9px] font-bold text-gray-950 flex items-center justify-center">
          3
        </span>
      </Button>
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback className="bg-amber-500 text-gray-950 text-xs font-bold">
          AD
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
