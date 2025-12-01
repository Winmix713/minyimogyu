import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/molecules/Table";
import { ChevronUp, ChevronDown } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T, index: number) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor?: (item: T, index: number) => string;
  selectable?: boolean;
  onRowClick?: (item: T, index: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  striped?: boolean;
  hover?: boolean;
  perPage?: number;
  showPagination?: boolean;
}

function DataTable<T>({
  columns,
  data,
  keyExtractor,
  selectable = false,
  onRowClick,
  loading = false,
  emptyMessage = "No data available",
  striped = true,
  hover = true,
  perPage = 10,
  showPagination = false,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortConfig.key];
      const bValue = (b as Record<string, unknown>)[sortConfig.key];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;

    const startIndex = (currentPage - 1) * perPage;
    return sortedData.slice(startIndex, startIndex + perPage);
  }, [sortedData, currentPage, perPage, showPagination]);

  const totalPages = Math.ceil(sortedData.length / perPage);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === "asc"
          ? { key, direction: "desc" }
          : null;
      }
      return { key, direction: "asc" };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = paginatedData.map((item, idx) =>
        keyExtractor ? keyExtractor(item, idx) : idx.toString()
      );
      setSelectedRows(new Set(allKeys));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (key: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(key);
    } else {
      newSelected.delete(key);
    }
    setSelectedRows(newSelected);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table striped={striped}>
        <TableHead>
          <TableRow>
            {selectable && (
              <TableHeaderCell>
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                />
              </TableHeaderCell>
            )}
            {columns.map((column) => (
              <TableHeaderCell
                key={column.key}
                sortable={column.sortable}
                sorted={sortConfig?.key === column.key ? sortConfig.direction : false}
                onClick={() => column.sortable && handleSort(column.key)}
                align={column.align}
              >
                {column.label}
                {column.sortable && sortConfig?.key === column.key && (
                  <span className="ml-2">
                    {sortConfig.direction === "asc" ? (
                      <ChevronUp className="w-4 h-4 inline" />
                    ) : (
                      <ChevronDown className="w-4 h-4 inline" />
                    )}
                  </span>
                )}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody striped={striped} hover={hover}>
          {paginatedData.map((item, index) => {
            const rowKey = keyExtractor ? keyExtractor(item, index) : index.toString();
            const isSelected = selectedRows.has(rowKey);

            return (
              <TableRow
                key={rowKey}
                isStriped={striped && index % 2 === 1}
                hover={hover}
                className={cn(onRowClick && "cursor-pointer")}
                onClick={() => onRowClick && onRowClick(item, index)}
              >
                {selectable && (
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(rowKey, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={column.key} align={column.align}>
                    {column.render
                      ? column.render(
                          (item as Record<string, unknown>)[column.key],
                          item,
                          index
                        )
                      : String((item as Record<string, unknown>)[column.key])}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
