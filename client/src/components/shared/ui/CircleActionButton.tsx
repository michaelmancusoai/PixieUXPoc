import React from "react";

interface CircleActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

/**
 * CircleActionButton - A reusable circular action button with an icon and label
 */
export default function CircleActionButton({ icon, label, onClick }: CircleActionButtonProps) {
  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1 hover:bg-gray-200 transition-colors cursor-pointer"
        onClick={onClick}
      >
        <div className="text-gray-600">{icon}</div>
      </div>
      <span className="text-[10px] font-medium text-gray-700">{label}</span>
    </div>
  );
}