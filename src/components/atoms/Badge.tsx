import React from "react";
import { cn } from "@/lib/utils";

export type BadgeColor = "success" | "warning" | "error" | "info" | "neutral" | "primary";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "soft";
}

const colorClasses: Record<BadgeColor, Record<string, string>> = {
  success: {
    solid: "bg-green-100 text-green-800",
    outline: "border border-green-300 text-green-800",
    soft: "bg-green-50 text-green-700",
  },
  warning: {
    solid: "bg-yellow-100 text-yellow-800",
    outline: "border border-yellow-300 text-yellow-800",
    soft: "bg-yellow-50 text-yellow-700",
  },
  error: {
    solid: "bg-red-100 text-red-800",
    outline: "border border-red-300 text-red-800",
    soft: "bg-red-50 text-red-700",
  },
  info: {
    solid: "bg-blue-100 text-blue-800",
    outline: "border border-blue-300 text-blue-800",
    soft: "bg-blue-50 text-blue-700",
  },
  neutral: {
    solid: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-800",
    soft: "bg-gray-50 text-gray-700",
  },
  primary: {
    solid: "bg-indigo-100 text-indigo-800",
    outline: "border border-indigo-300 text-indigo-800",
    soft: "bg-indigo-50 text-indigo-700",
  },
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ color = "neutral", variant = "solid", className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
          colorClasses[color][variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
