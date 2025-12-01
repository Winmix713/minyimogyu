import React from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import Input from "@/components/atoms/Input";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  loading?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onClear, loading = false, value, onChange, className, ...props }, ref) => {
    return (
      <div className={cn("relative w-full", className)}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          className={cn(
            "w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "placeholder-gray-400 text-sm"
          )}
          placeholder="Search..."
          {...props}
        />
        {loading && (
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {value && !loading && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
