import React from "react";
import { cn } from "@/lib/utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
  color?: string;
  width?: string;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ direction = "horizontal", color = "border-gray-200", width = "1px", className, ...props }, ref) => {
    if (direction === "vertical") {
      return (
        <div
          ref={ref}
          className={cn("border-l", color, className)}
          style={{ width }}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn("border-t", color, className)}
        style={{ height: width }}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";

export default Divider;
