import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/navigation/Sidebar";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import UserMenu from "@/components/navigation/UserMenu";
import { cn } from "@/lib/utils";
import { Shield, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  className?: string;
}

const AdminLayout = ({ className }: AdminLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const CollapseIcon = isSidebarCollapsed ? PanelLeftOpen : PanelLeftClose;
  const contentOffset = isSidebarCollapsed ? "md:ml-20" : "md:ml-64";

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      
      {/* Main Content with offset for sidebar */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        contentOffset,
        className
      )}>
        {/* Top Navigation Bar with Admin indicator */}
        <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileSidebarOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex"
                onClick={() => setIsSidebarCollapsed((prev) => !prev)}
                aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <CollapseIcon className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-destructive/10 text-destructive">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Admin</span>
              </div>
              <Breadcrumb />
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;