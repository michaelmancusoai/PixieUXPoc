import React from 'react';

interface ThreeColumnLayoutProps {
  leftColumn: React.ReactNode;
  centerColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}

/**
 * ThreeColumnLayout - A reusable layout for pages that require three columns
 * Left column: usually for patient information
 * Center column: usually for activity feed or main content
 * Right column: usually for related records
 */
export default function ThreeColumnLayout({ 
  leftColumn, 
  centerColumn, 
  rightColumn 
}: ThreeColumnLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3">
        {leftColumn}
      </div>
      
      <div className="lg:col-span-5">
        {centerColumn}
      </div>
      
      <div className="lg:col-span-4">
        {rightColumn}
      </div>
    </div>
  );
}