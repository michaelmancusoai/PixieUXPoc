import React from 'react';

interface PageLayoutProps {
  header?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * PageLayout - A common layout component for pages with consistent padding and structure
 */
export default function PageLayout({ header, children }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {header && (
        <div className="w-full">
          {header}
        </div>
      )}
      
      <main className="flex-1 container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}