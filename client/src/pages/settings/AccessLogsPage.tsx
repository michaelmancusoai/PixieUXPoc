import SettingsPageTemplate from "@/pages/settings/SettingsPageTemplate";
import { FileBarChart } from "lucide-react";

export default function AccessLogsPage() {
  return (
    <SettingsPageTemplate
      title="Access Logs"
      description="View system access history and security events"
      icon={<FileBarChart className="h-5 w-5" />}
    />
  );
}