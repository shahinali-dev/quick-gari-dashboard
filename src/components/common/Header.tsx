import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 gap-4 shrink-0">
      <div className="flex-1">
        <p className="text-sm text-gray-400">Welcome back 👋</p>
        <h2 className="text-base font-semibold text-gray-900 leading-tight">
          {user?.name || "Quick Gari Admin"}
        </h2>
      </div>
      <Button variant="outline" size="icon" className="relative">
        <Bell size={16} />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-[9px] font-bold text-gray-950 flex items-center justify-center">
          3
        </span>
      </Button>
      <Avatar className="h-8 w-8">
        <AvatarImage src={user?.avatar} />
        <AvatarFallback className="bg-amber-500 text-gray-950 text-xs font-bold">
          {user ? getInitials(user.name) : "AD"}
        </AvatarFallback>
      </Avatar>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        title="Logout"
        className="text-gray-600 hover:text-gray-900"
      >
        <LogOut size={18} />
      </Button>
    </header>
  );
}
