import React from "react";
import { cn } from "@/lib/utils";
import RecordItem from "./RecordItem";
import { Skeleton } from "@/components/ui/skeleton";

interface RecordListProps<T> {
  data?: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  className?: string;
  skeletonCount?: number;
}

/**
 * RecordList - A generic component for rendering lists of records
 * Works with any data type and handles loading/empty states
 */
export default function RecordList<T>({
  data,
  isLoading = false,
  emptyMessage = "No records found",
  renderItem,
  keyExtractor,
  className,
  skeletonCount = 3,
}: RecordListProps<T>) {
  if (isLoading) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn("text-center py-4", className)}>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {data.map((item, index) => (
        <React.Fragment key={keyExtractor(item)}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
}