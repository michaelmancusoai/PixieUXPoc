import * as React from "react";
import { cn } from "@/lib/utils";

// Timeline component
const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative space-y-4 pl-6", className)}
    {...props}
  />
));
Timeline.displayName = "Timeline";

// Timeline item
const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative pb-4 last:pb-0 before:absolute before:left-0 before:top-7 before:h-[calc(100%-28px)] before:w-[2px] before:bg-border last:before:hidden",
      className
    )}
    {...props}
  />
));
TimelineItem.displayName = "TimelineItem";

// Timeline marker
const TimelineMarker = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    color?: "default" | "primary" | "success" | "warning" | "destructive";
  }
>(({ className, color = "default", ...props }, ref) => {
  const colorClasses = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary text-primary-foreground",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    destructive: "bg-destructive text-destructive-foreground",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "absolute left-[-11px] flex h-6 w-6 items-center justify-center rounded-full",
        colorClasses[color],
        className
      )}
      {...props}
    />
  );
});
TimelineMarker.displayName = "TimelineMarker";

// Timeline header
const TimelineHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-1 flex items-center justify-between", className)}
    {...props}
  />
));
TimelineHeader.displayName = "TimelineHeader";

// Timeline title
const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-sm font-medium", className)}
    {...props}
  />
));
TimelineTitle.displayName = "TimelineTitle";

// Timeline time
const TimelineTime = React.forwardRef<
  HTMLTimeElement,
  React.TimeHTMLAttributes<HTMLTimeElement>
>(({ className, ...props }, ref) => (
  <time
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
));
TimelineTime.displayName = "TimelineTime";

// Timeline content
const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
TimelineContent.displayName = "TimelineContent";

export {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineHeader,
  TimelineTitle,
  TimelineTime,
  TimelineContent,
};
