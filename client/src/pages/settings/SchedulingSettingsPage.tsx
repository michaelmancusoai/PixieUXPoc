import SettingsPageTemplate from "@/pages/settings/SettingsPageTemplate";
import { Calendar } from "lucide-react";

export default function SchedulingSettingsPage() {
  return (
    <SettingsPageTemplate
      title="Scheduling"
      description="Configure appointment types, durations, and availability"
      icon={<Calendar className="h-5 w-5" />}
    />
  );
}