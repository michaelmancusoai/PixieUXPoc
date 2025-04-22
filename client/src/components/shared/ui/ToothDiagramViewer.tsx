import React from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Eye, Map } from "lucide-react";
import ToothDiagram from "../../patient/ToothDiagram";

interface ToothDiagramViewerProps {
  title: string;
  subtitle: string;
  value: string;
  toothNumber: number;
}

/**
 * ToothDiagramViewer - A reusable component for displaying procedures with tooth diagram
 */
export default function ToothDiagramViewer({ title, subtitle, value, toothNumber }: ToothDiagramViewerProps) {
  return (
    <Collapsible>
      <div className="p-2 hover:bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          </div>
          <div className="flex items-center">
            <div className="font-medium mr-2">{value}</div>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" title="View Tooth Location">
                <Map className="h-3.5 w-3.5" />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <div className="mt-2 border-t pt-2 bg-gray-50 p-2">
            <div className="text-xs font-medium mb-1 text-center">Tooth #{toothNumber} Location</div>
            <ToothDiagram highlightedTooth={toothNumber} />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}