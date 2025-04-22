import React from "react";
import { Button } from "@/components/ui/button";
import RecordItem from "./RecordItem";

interface RecordListProps {
  items: Array<{
    title: string;
    subtitle: string;
    meta?: string;
    value?: string;
    status?: React.ReactNode;
    action?: React.ReactNode;
  }>;
  primaryAction?: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
  };
}

/**
 * RecordList - A reusable component for displaying a list of records with consistent styling
 */
export default function RecordList({ items, primaryAction, secondaryAction }: RecordListProps) {
  return (
    <>
      <div className="border rounded divide-y">
        {items.map((item, index) => (
          <RecordItem
            key={index}
            title={item.title}
            subtitle={item.subtitle}
            meta={item.meta}
            value={item.value}
            status={item.status}
            action={item.action}
          />
        ))}
      </div>
      
      {(primaryAction || secondaryAction) && (
        <div className="flex justify-between mt-2">
          {primaryAction && (
            <Button variant="default" size="sm" className="h-8" onClick={primaryAction.onClick}>
              {primaryAction.icon}
              {primaryAction.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button variant="ghost" size="sm" className="h-8" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </>
  );
}