import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  Code2,
  Terminal,
  MessageSquare,
  ShoppingBag,
  Puzzle,
  Server,
  Settings,
  User,
  BarChart3,
  Rocket,
  History,
  Library,
  ChevronLeft,
  ChevronRight,
  Boxes,
  BotMessageSquare,
  Shield,
} from "lucide-react";
import { SSBotsLogo } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Boxes, label: "Workspaces", path: "/workspaces" },
  { icon: Code2, label: "Editor", path: "/editor" },
  { icon: Bot, label: "Bots", path: "/bots" },
  { icon: BotMessageSquare, label: "Chat IA", path: "/chat" },
  { icon: Terminal, label: "Terminal", path: "/terminal" },
];

const secondaryNavItems = [
  { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
  { icon: Puzzle, label: "Integrações", path: "/integrations" },
  { icon: Server, label: "MCP Hub", path: "/mcp" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Rocket, label: "Deploy", path: "/deploy" },
  { icon: History, label: "Histórico", path: "/history" },
  { icon: Library, label: "Biblioteca", path: "/library" },
];

const bottomNavItems = [
  { icon: User, label: "Perfil", path: "/profile" },
  { icon: Settings, label: "Configurações", path: "/settings" },
  { icon: Shield, label: "Admin", path: "/admin" },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  const NavItem = ({
    item,
  }: {
    item: (typeof mainNavItems)[number];
  }) => {
    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <NavLink
            to={item.path}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-muted hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-lg bg-primary/10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <item.icon className="relative z-10 h-5 w-5 shrink-0" />
            {!collapsed && (
              <span className="relative z-10 truncate">{item.label}</span>
            )}
          </NavLink>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
      </Tooltip>
    );
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-14 items-center border-b border-sidebar-border px-4", collapsed && "justify-center")}>
        <NavLink to="/dashboard">
          <SSBotsLogo size={collapsed ? "sm" : "md"} />
        </NavLink>
        <button
          onClick={onToggle}
          className={cn(
            "ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-muted hover:text-foreground transition-colors",
            collapsed && "ml-0"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>
        {!collapsed && (
          <p className="mt-5 mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Ferramentas
          </p>
        )}
        <nav className="space-y-1">
          {secondaryNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border px-2 py-2">
        <nav className="space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
