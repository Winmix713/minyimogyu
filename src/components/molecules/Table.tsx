import React from "react";
import { cn } from "@/lib/utils";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, striped = true, hover = true, compact = false, children, ...props }, ref) => {
    return (
      <div className="w-full overflow-x-auto">
        <table
          ref={ref}
          className={cn(
            "w-full border-collapse text-sm",
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = "Table";

interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableHead = React.forwardRef<HTMLTableSectionElement, TableHeadProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn("bg-gray-50 border-b border-gray-200", className)}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

TableHead.displayName = "TableHead";

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
  striped?: boolean;
  hover?: boolean;
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, striped = true, hover = true, children, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={cn(
          striped && "divide-y divide-gray-200",
          className
        )}
        {...props}
      >
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = "TableBody";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  hover?: boolean;
  striped?: boolean;
  isStriped?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, hover = true, striped = false, isStriped = false, children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          "border-b border-gray-200",
          hover && "hover:bg-gray-50 transition-colors",
          (isStriped || striped) && "even:bg-gray-50",
          className
        )}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = "TableRow";

interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  sortable?: boolean;
  sorted?: "asc" | "desc" | false;
}

const TableHeaderCell = React.forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({ className, sortable = false, sorted = false, children, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          "px-4 py-3 text-left text-xs font-semibold text-gray-700",
          sortable && "cursor-pointer hover:bg-gray-100 select-none",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          {children}
          {sortable && sorted && (
            <span className="ml-auto">
              {sorted === "asc" ? "↑" : "↓"}
            </span>
          )}
        </div>
      </th>
    );
  }
);

TableHeaderCell.displayName = "TableHeaderCell";

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align = "left", children, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn(
          "px-4 py-3 text-sm",
          align === "center" && "text-center",
          align === "right" && "text-right",
          className
        )}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = "TableCell";

export { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell };
