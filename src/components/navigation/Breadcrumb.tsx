import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  className?: string;
}

const Breadcrumb = ({ className }: BreadcrumbProps) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Route name mapping for better display
  const routeNameMap: Record<string, string> = {
    dashboard: "Dashboard",
    predictions: "Predictions",
    new: "New",
    matches: "Matches",
    match: "Match Details",
    teams: "Teams",
    leagues: "Leagues",
    jobs: "Jobs",
    models: "Models",
    crossleague: "Cross-League",
    monitoring: "Monitoring",
    analytics: "Analytics",
    phase9: "Phase 9",
    admin: "Admin",
    users: "User Management",
    settings: "Settings",
    environment: "Environment",
    "model-status": "Model Status",
    integrations: "Integrations",
    stats: "Stats",
    health: "Health",
    feedback: "Feedback",
    "prediction-analyzer": "Prediction Analyzer",
    "ai-chat": "AI Chat",
  };

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
      aria-label="Breadcrumb"
    >
      <Link
        to="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <div key={routeTo} className="flex items-center space-x-1">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="font-medium text-foreground">{displayName}</span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-foreground transition-colors"
              >
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
