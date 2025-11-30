import React, { useMemo, useState } from "react";
import {
  Home,
  Users,
  Calendar as CalendarIcon,
  Trophy,
  Settings as SettingsIcon,
  Sparkles,
  Clock,
  Brain,
  LayoutDashboard,
  ListChecks,
  LineChart,
  FlaskConical,
  Network,
  Activity,
  Shield,
  Key,
  Bot,
  Gauge,
  BarChart3,
  TrendingUp,
  X,
  ChevronLeft,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { usePhaseFlags } from "@/hooks/usePhaseFlags";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

const iconMap = {
  home: Home,
  dashboard: LayoutDashboard,
  analytics: LineChart,
  aiChat: Bot,
  patterns: Shield,
  predictionsNew: Sparkles,
  predictions: ListChecks,
  teams: Users,
  matches: CalendarIcon,
  jobs: Clock,
  models: FlaskConical,
  crossleague: Network,
  monitoring: Activity,
  leagues: Trophy,
  phase9: Brain,
  adminJobs: Clock,
  adminModels: FlaskConical,
  adminMatches: CalendarIcon,
  adminMonitoring: Activity,
  modelStatus: Gauge,
  adminEnvironment: Key,
  adminDashboard: BarChart3,
  predictionAnalyzer: TrendingUp,
  settings: SettingsIcon,
} as const;

type IconKey = keyof typeof iconMap;

interface NavItem {
  key: IconKey;
  to: string;
  label: string;
  requiredRoles?: UserRole[];
  phase?: number;
  section: "main" | "admin";
}

const navigationItems: NavItem[] = [
  { key: "home", to: "/", label: "Home", section: "main" },
  { key: "dashboard", to: "/dashboard", label: "Dashboard", section: "main" },
  { key: "analytics", to: "/analytics", label: "Analytics", section: "main", phase: 8 },
  { key: "aiChat", to: "/ai-chat", label: "AI Chat", section: "main" },
  { key: "patterns", to: "/patterns", label: "Patterns", section: "main", phase: 5 },
  { key: "predictionsNew", to: "/predictions/new", label: "New Prediction", section: "main" },
  { key: "predictions", to: "/predictions", label: "Predictions", section: "main" },
  { key: "teams", to: "/teams", label: "Teams", section: "main" },
  { key: "matches", to: "/matches", label: "Matches", section: "main" },
  { key: "jobs", to: "/jobs", label: "Jobs", section: "main", requiredRoles: ["admin", "analyst"] },
  { key: "models", to: "/models", label: "Models", section: "main", phase: 6 },
  { key: "crossleague", to: "/crossleague", label: "Cross-League", section: "main", phase: 7 },
  { key: "monitoring", to: "/monitoring", label: "Monitoring", section: "main", phase: 8 },
  { key: "predictionAnalyzer", to: "/prediction-analyzer", label: "Prediction Analyzer", section: "main", phase: 8 },
  { key: "leagues", to: "/leagues", label: "Leagues", section: "main" },
  { key: "phase9", to: "/phase9", label: "Phase 9", section: "main", phase: 9 },
  { key: "settings", to: "/settings", label: "Settings", section: "main" },
  { key: "adminDashboard", to: "/admin", label: "Admin Overview", section: "admin", requiredRoles: ["admin", "analyst"] },
  { key: "adminJobs", to: "/admin/jobs", label: "Job Management", section: "admin", requiredRoles: ["admin", "analyst"] },
  { key: "adminModels", to: "/admin/models", label: "Model Management", section: "admin", requiredRoles: ["admin", "analyst"], phase: 6 },
  { key: "adminMatches", to: "/admin/matches", label: "Match Management", section: "admin", requiredRoles: ["admin", "analyst"], phase: 8 },
  { key: "adminMonitoring", to: "/admin/monitoring", label: "System Monitoring", section: "admin", requiredRoles: ["admin", "analyst"], phase: 8 },
  { key: "modelStatus", to: "/admin/model-status", label: "Model Status", section: "admin", requiredRoles: ["admin", "analyst"] },
  { key: "adminEnvironment", to: "/admin/environment", label: "Environment", section: "admin", requiredRoles: ["admin"] },
];

interface SidebarProps {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
}

const SidebarNavItem = ({ item, collapsed, onNavigate }: { item: NavItem; collapsed: boolean; onNavigate?: () => void }) => {
  const Icon = iconMap[item.key];
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
        )
      }
    >
      <Icon className="h-5 w-5" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  );
};

const SidebarSection = ({
  title,
  items,
  collapsed,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  collapsed: boolean;
  onNavigate?: () => void;
}) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <p className={cn("px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground", collapsed && "sr-only")}>{title}</p>
      <div className="mt-3 space-y-1">
        {items.map((item) => (
          <SidebarNavItem key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);

  const isCollapsed = collapsed ?? internalCollapsed;
  const isMobileOpen = mobileOpen ?? internalMobileOpen;

  const { isPhase5Enabled, isPhase6Enabled, isPhase7Enabled, isPhase8Enabled, isPhase9Enabled } = usePhaseFlags();
  const { hasAnyRole } = useAuth();

  const phaseFlags = useMemo(
    () => ({
      5: isPhase5Enabled,
      6: isPhase6Enabled,
      7: isPhase7Enabled,
      8: isPhase8Enabled,
      9: isPhase9Enabled,
    }),
    [isPhase5Enabled, isPhase6Enabled, isPhase7Enabled, isPhase8Enabled, isPhase9Enabled]
  );

  const filteredItems = navigationItems.filter((item) => {
    if (item.requiredRoles && !hasAnyRole(item.requiredRoles)) {
      return false;
    }

    if (item.phase && !phaseFlags[item.phase as keyof typeof phaseFlags]) {
      return false;
    }

    return true;
  });

  const mainItems = filteredItems.filter((item) => item.section === "main");
  const adminItems = filteredItems.filter((item) => item.section === "admin");

  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  const handleCloseMobile = () => {
    if (onCloseMobile) {
      onCloseMobile();
    } else {
      setInternalMobileOpen(false);
    }
  };

  const handleNavigate = () => {
    if (isMobileOpen) {
      handleCloseMobile();
    }
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex fixed top-0 left-0 z-40 h-screen flex-col border-r border-border bg-background/95 backdrop-blur transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-card ring-1 ring-border grid place-items-center text-primary text-[10px] font-semibold tracking-tight">
              WT
            </div>
            {!isCollapsed && <span className="text-sm font-semibold">WinMix TipsterHub</span>}
          </NavLink>
          <button
            type="button"
            onClick={handleToggleCollapse}
            className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")}
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
          <SidebarSection title="Navigation" items={mainItems} collapsed={isCollapsed} onNavigate={handleNavigate} />
          <SidebarSection title="Admin" items={adminItems} collapsed={isCollapsed} onNavigate={handleNavigate} />
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-opacity duration-200",
          isMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleCloseMobile} />
        <div className="relative h-full w-72 bg-background shadow-xl">
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-card ring-1 ring-border grid place-items-center text-primary text-[10px] font-semibold tracking-tight">
                WT
              </div>
              <span className="text-sm font-semibold">WinMix TipsterHub</span>
            </div>
            <button type="button" onClick={handleCloseMobile} className="h-9 w-9 rounded-full border border-border grid place-items-center">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="h-[calc(100%-4rem)] overflow-y-auto px-4 py-4 space-y-6">
            <SidebarSection title="Navigation" items={mainItems} collapsed={false} onNavigate={handleNavigate} />
            <SidebarSection title="Admin" items={adminItems} collapsed={false} onNavigate={handleNavigate} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
