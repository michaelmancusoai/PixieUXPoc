import { Dashboard } from "@/components/Dashboard";
import { NavigationWrapper } from "@/components/NavigationWrapper";

export default function TodayPage() {
  return (
    <NavigationWrapper>
      <h1 className="text-2xl font-bold mb-6">Today at a Glance</h1>
      <Dashboard />
    </NavigationWrapper>
  );
}