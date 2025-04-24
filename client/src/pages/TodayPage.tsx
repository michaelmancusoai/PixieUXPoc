import React from 'react';
import RoleDashboard from '../features/dashboard/components/RoleDashboard';

const TodayPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <RoleDashboard />
    </div>
  );
};

export default TodayPage;