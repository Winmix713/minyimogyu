import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined" | "ghost";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const variantClasses: Record<string, string> = {
  default: "bg-white border border-gray-200 rounded-lg shadow-sm",
  elevated: "bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow",
  outlined: "bg-transparent border border-gray-200 rounded-lg",
  ghost: "bg-transparent border-0 rounded-lg",
};

const paddingClasses: Record<string, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", padding = "md", hover = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          paddingClasses[padding],
          hover && "hover:shadow-lg transition-shadow cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
