import { NavLink } from "react-router-dom";
import { LayoutDashboard, History, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-body transition-colors ${
      isActive
        ? "bg-accent/10 text-accent"
        : "text-text-secondary hover:text-text-primary hover:bg-surface"
    }`;

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col border-r border-border bg-surface/50 px-4 py-6">
      <div className="flex items-center justify-between px-2 mb-8">
        <span className="font-display text-lg text-text-primary tracking-tight">
          Resume<span className="text-accent">.</span>AI
        </span>
        <ThemeToggle />
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <NavLink to="/dashboard" end className={linkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink to="/dashboard/history" className={linkClass}>
          <History size={18} />
          History
        </NavLink>
      </nav>

      <div className="border-t border-border pt-4 px-2">
        <p className="text-sm text-text-primary font-body truncate">{user?.name}</p>
        <p className="text-xs text-text-secondary font-body truncate mb-3">{user?.email}</p>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-red-400 transition-colors font-body"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
};