import React from 'react';
import { NavigationWrapper } from "@/components/NavigationWrapper";
import RoleDashboard from '../../features/dashboard/components/RoleDashboard';

export default function TodayPage() {
  return (
    <NavigationWrapper>
      <div className="container mx-auto py-4">
        <RoleDashboard />
      </div>
    </NavigationWrapper>
  );
}