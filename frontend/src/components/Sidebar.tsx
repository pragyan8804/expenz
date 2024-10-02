import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, ChevronLeft } from "lucide-react";
import { HomeIcon, ListIcon, SettingsIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={cn(
        "h-screen p-4 bg-gray-50 text-black transition-all dark:bg-gray-900 dark:text-white",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        className={cn(
          "w-full flex mb-5",
          collapsed ? "justify-center" : "justify-end"
        )}
      >
        {collapsed ? (
          <Menu className="h-6 w-6" />
        ) : (
          <ChevronLeft className="h-6 w-6" />
        )}
      </Button>

      <nav className="space-y-2">
        <NavItem href="/dashboard" title="Dashboard" icon={<HomeIcon />} collapsed={collapsed} />
        <NavItem href="/transactions" title="Transactions" icon={<ListIcon />} collapsed={collapsed} />
        <NavItem href="/settings" title="Settings" icon={<SettingsIcon />} collapsed={collapsed} />
      </nav>
    </aside>
  );
}

function NavItem({ href, title, icon, collapsed }: { href: string; title: string; icon: React.ReactNode; collapsed: boolean }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <a
            href={href}
            className={cn(
              "flex items-center p-2 rounded-md hover:bg-gray-200 text-black dark:hover:bg-gray-800 dark:text-white",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            <span className={cn("text-xl", collapsed ? "" : "mr-4")}>{icon}</span>
            {!collapsed && <span className="text-sm">{title}</span>}
          </a>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right" className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white">{title}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
}