import * as React from "react";
import { cn } from "@/lib/utils";

// DataGrid component
const DataGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    pagination?: boolean;
    density?: "default" | "compact";
  }
>(({ className, pagination = false, density = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden rounded-md border bg-background",
      className
    )}
    {...props}
  />
));
DataGrid.displayName = "DataGrid";

// DataGrid header
const DataGridHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-muted/50 px-4 py-3 flex items-center justify-between",
      className
    )}
    {...props}
  />
));
DataGridHeader.displayName = "DataGridHeader";

// DataGrid title
const DataGridTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-sm font-medium", className)}
    {...props}
  />
));
DataGridTitle.displayName = "DataGridTitle";

// DataGrid body
const DataGridBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("divide-y", className)}
    {...props}
  />
));
DataGridBody.displayName = "DataGridBody";

// DataGrid row
const DataGridRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    selected?: boolean;
  }
>(({ className, selected = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-4 py-3 hover:bg-muted/50 flex items-center",
      selected && "bg-muted/50",
      className
    )}
    {...props}
  />
));
DataGridRow.displayName = "DataGridRow";

// DataGrid cell
const DataGridCell = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    width?: string;
  }
>(({ className, width, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm", className)}
    style={{ width }}
    {...props}
  />
));
DataGridCell.displayName = "DataGridCell";

// DataGrid footer
const DataGridFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-muted/50 px-4 py-3 flex items-center justify-between",
      className
    )}
    {...props}
  />
));
DataGridFooter.displayName = "DataGridFooter";

// DataGrid pagination
const DataGridPagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center space-x-2", className)}
    {...props}
  />
));
DataGridPagination.displayName = "DataGridPagination";

export {
  DataGrid,
  DataGridHeader,
  DataGridTitle,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridFooter,
  DataGridPagination,
};
