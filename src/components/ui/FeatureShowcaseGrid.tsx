import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Award,
  Globe,
  Clock
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}

interface FeatureShowcaseGridProps {
  features?: Feature[];
  className?: string;
  columns?: 2 | 3 | 4;
}

const defaultFeatures: Feature[] = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "AI-Powered Predictions",
    description: "Advanced machine learning algorithms analyze thousands of data points for accurate match predictions",
    highlight: true
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Risk Management",
    description: "Built-in risk assessment tools help you make informed decisions and manage your bankroll effectively"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Real-time Analytics",
    description: "Live odds tracking and performance metrics keep you updated throughout the match"
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Detailed Statistics",
    description: "Comprehensive team and player statistics with historical performance data"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community Insights",
    description: "Connect with other tipsters and share strategies in our vibrant community"
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Expert Analysis",
    description: "Professional tipsters provide detailed match breakdowns and betting insights"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Coverage",
    description: "Track matches and predictions from leagues and tournaments worldwide"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "24/7 Updates",
    description: "Round-the-clock match updates and breaking news affecting your predictions"
  }
];

const FeatureShowcaseGrid = ({ 
  features = defaultFeatures,
  className,
  columns = 4
}: FeatureShowcaseGridProps) => {
  const columnClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("grid gap-6", columnClasses[columns])}>
        {features.map((feature, index) => (
          <div
            key={index}
            className={cn(
              "relative group p-6 rounded-2xl bg-card/50 backdrop-blur-sm ring-1 ring-border/50 transition-all duration-300 hover:scale-[1.02] hover:ring-primary/50 hover:bg-card/80",
              feature.highlight && "ring-2 ring-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
            )}
          >
            {feature.highlight && (
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            )}
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 ring-1 ring-border/50 mb-4 text-primary">
                {feature.icon}
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2 tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              
              {feature.highlight && (
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Featured
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureShowcaseGrid;