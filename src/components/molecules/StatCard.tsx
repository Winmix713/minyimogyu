import React from "react";
import { cn } from "@/lib/utils";
import Card from "./Card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  icon?: React.ReactNode;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "gray";
  description?: string;
}

const colorClasses: Record<string, string> = {
  blue: "bg-blue-50 border-blue-100",
  green: "bg-green-50 border-green-100",
  red: "bg-red-50 border-red-100",
  yellow: "bg-yellow-50 border-yellow-100",
  purple: "bg-purple-50 border-purple-100",
  gray: "bg-gray-50 border-gray-100",
};

const iconColorClasses: Record<string, string> = {
  blue: "text-blue-600 bg-blue-100",
  green: "text-green-600 bg-green-100",
  red: "text-red-600 bg-red-100",
  yellow: "text-yellow-600 bg-yellow-100",
  purple: "text-purple-600 bg-purple-100",
  gray: "text-gray-600 bg-gray-100",
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  color = "blue",
  description,
}) => {
  const arrowIcon = change !== undefined && change !== 0 && (
    changeType === "increase" ? (
      <ArrowUp className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-red-600" />
    )
  );

  return (
    <Card
      variant="elevated"
      padding="md"
      className={cn("border", colorClasses[color])}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600 uppercase">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change !== undefined && change !== 0 && (
              <span className={cn(
                "flex items-center gap-1 text-xs font-medium",
                changeType === "increase" ? "text-green-600" : "text-red-600"
              )}>
                {arrowIcon}
                {Math.abs(change)}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
        </div>
        {icon && (
          <div className={cn(
            "p-3 rounded-lg",
            iconColorClasses[color]
          )}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
