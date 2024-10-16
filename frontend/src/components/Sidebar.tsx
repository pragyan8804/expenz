import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { HomeIcon, ListIcon, SettingsIcon, LogOutIcon, ReceiptText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import LogoutDialog from "@/components/Dialogs/LogoutDialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

export function Sidebar() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <aside className="h-screen p-4 bg-neutral-50 text-black transition-all dark:bg-neutral-900 dark:text-white flex flex-col justify-between">
      {/* Sidebar Navigation */}
      <div className="flex flex-col items-center space-y-4">
        <img src="/public/logo.png" alt="Logo" className="h-8 w-8" />

        <nav className="flex flex-col space-y-2">
          <NavItem href="/dashboard" icon={<HomeIcon />} title="Dashboard" />
          <NavItem href="/transactions" icon={<ListIcon />} title="Transactions" />
          <NavItem href="/Split" icon={<ReceiptText />} title="Split" />
          <NavItem href="/settings" icon={<SettingsIcon />} title="Settings" />
        </nav>

        <Button onClick={() => setDialogOpen(true)} variant="ghost" className="flex items-center mt-4 w-full justify-start">
          <LogOutIcon className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar Open Button */}
      <div className="flex flex-col items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mt-auto mb-16">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="p-4 w-64 dark:text-white">
            <div className="flex items-center justify-start mb-5">
              <img src="/public/logo.png" alt="Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">Expenz</span>
            </div>

            {/*inside the sheet */}
            <nav className="space-y-2">
              <NavItem href="/dashboard" icon={<HomeIcon />} title="Dashboard" showText />
              <NavItem href="/transactions" icon={<ListIcon />} title="Transactions" showText />
              <NavItem href="/Split" icon={<ReceiptText />} title="Split" showText />
              <NavItem href="/settings" icon={<SettingsIcon />} title="Settings" showText />
            </nav>

            <Button onClick={() => setDialogOpen(true)} variant="ghost" className="flex items-center mt-4 w-full justify-start">
              <LogOutIcon className="h-6 w-6" />
              <span className="ml-2">Log Out</span>
            </Button>
          </SheetContent>
        </Sheet>
      </div>

      <LogoutDialog isOpen={isDialogOpen} onOpenChange={setDialogOpen} />
    </aside>
  );
}

function NavItem({ href, icon, title, showText = false }: { href: string; icon: React.ReactNode; title: string; showText?: boolean }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Link
            to={href}
            className="flex items-center p-2 rounded-md hover:bg-neutral-200 text-black dark:hover:bg-neutral-800 dark:text-white"
          >
            <span className="text-xl">{icon}</span>
            {showText && <span className="ml-2 text-sm">{title}</span>}
            {!showText && <span className="hidden">{title}</span>}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white">
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
