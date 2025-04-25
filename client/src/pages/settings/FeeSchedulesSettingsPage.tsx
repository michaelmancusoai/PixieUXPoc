import SettingsPageTemplate from "@/pages/settings/SettingsPageTemplate";
import { FileBarChart } from "lucide-react";

export default function FeeSchedulesSettingsPage() {
  return (
    <SettingsPageTemplate
      title="Fee Schedules"
      description="Manage procedure codes, fees, and insurance contracts"
      icon={<FileBarChart className="h-5 w-5" />}
    />
  );
}