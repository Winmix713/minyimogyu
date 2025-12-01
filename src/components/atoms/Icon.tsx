import React from "react";
import { cn } from "@/lib/utils";

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
}

const sizeClasses: Record<string, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const Icon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ size = "md", color = "currentColor", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center", sizeClasses[size], className)}
        style={{ color }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Icon.displayName = "Icon";

export default Icon;
