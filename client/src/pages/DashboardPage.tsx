import { Dashboard } from "@/components/Dashboard";
import { NavigationWrapper } from "@/components/NavigationWrapper";

export default function DashboardPage() {
  return (
    <NavigationWrapper>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Dashboard />
    </NavigationWrapper>
  );
}