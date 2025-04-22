import React from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface AccordionSectionProps { 
  id: string; 
  icon: React.ReactNode; 
  title: string; 
  count: number; 
  children: React.ReactNode; 
}

/**
 * AccordionSection - A reusable component for displaying collapsible sections with consistent styling
 */
export default function AccordionSection({ 
  id, 
  icon, 
  title, 
  count, 
  children 
}: AccordionSectionProps) {
  return (
    <AccordionItem value={id} className="border-b">
      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
        <div className="flex items-center">
          <span className="text-muted-foreground mr-2">{icon}</span>
          <h3 className="font-medium">{title}</h3>
          <Badge variant="secondary" className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-muted-foreground">
            {count}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-3">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}