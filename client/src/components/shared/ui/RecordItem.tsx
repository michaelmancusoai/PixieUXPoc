import React from "react";

interface RecordItemProps { 
  title: string; 
  subtitle: string; 
  meta?: string; 
  value?: string; 
  status?: React.ReactNode; 
  action?: React.ReactNode; 
}

/**
 * RecordItem - A reusable component for displaying record information in a consistent format
 */
export default function RecordItem({ 
  title, 
  subtitle, 
  meta, 
  value, 
  status, 
  action 
}: RecordItemProps) {
  return (
    <div className="p-2 hover:bg-gray-50 flex justify-between items-center">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
        {meta && <div className="text-xs text-muted-foreground">{meta}</div>}
      </div>
      <div className="text-right">
        {value && <div className="font-medium">{value}</div>}
        {status && status}
        {action && action}
      </div>
    </div>
  );
}