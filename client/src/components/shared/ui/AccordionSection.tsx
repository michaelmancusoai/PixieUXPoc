import React from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AccordionSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
  onAddClick?: () => void;
}

/**
 * AccordionSection - A standardized accordion section with title, icon, and optional add button
 * Used primarily in the RelatedRecords component
 */
export default function AccordionSection({
  title,
  icon,
  defaultOpen = false,
  className,
  children,
  onAddClick,
}: AccordionSectionProps) {
  const value = defaultOpen ? "item-1" : undefined;

  return (
    <Accordion type="single" collapsible className={className} defaultValue={value}>
      <AccordionItem value="item-1" className="border-b-0">
        <div className="flex items-center justify-between">
          <AccordionTrigger className="py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              {icon && <span className="text-muted-foreground">{icon}</span>}
              <span className="font-medium text-sm">{title}</span>
            </div>
          </AccordionTrigger>
          
          {onAddClick && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={(e) => {
                e.stopPropagation();
                onAddClick();
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add {title}</span>
            </Button>
          )}
        </div>
        
        <AccordionContent className={cn("pt-1 pb-3", !children && "text-center")}>
          {children || <span className="text-xs text-muted-foreground">No records found</span>}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}