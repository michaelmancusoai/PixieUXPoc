import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecordItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  date?: string;
  status?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * RecordItem - A consistent card-based component for displaying record entries
 * Used for appointments, messages, notes, etc.
 */
export default function RecordItem({
  title,
  subtitle,
  description,
  date,
  status,
  icon,
  onClick,
  className,
  children
}: RecordItemProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer hover:bg-muted/50 transition-colors", 
        onClick && "hover:shadow-sm",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-3 flex">
        {icon && (
          <div className="mr-3 flex-shrink-0">
            {icon}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="text-sm font-medium line-clamp-1" title={title}>
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-muted-foreground line-clamp-1" title={subtitle}>
                  {subtitle}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {status && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-auto font-normal">
                  {status}
                </Badge>
              )}
              {date && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {date}
                </span>
              )}
            </div>
          </div>
          
          {description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
          
          {children && (
            <div className="mt-2">
              {children}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}