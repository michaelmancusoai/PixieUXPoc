import SettingsPageTemplate from "./SettingsPageTemplate";
import { Cog } from "lucide-react";

export default function APISettingsPage() {
  return (
    <SettingsPageTemplate
      title="API Settings"
      description="Manage API keys and external application access"
      icon={<Cog className="h-5 w-5 text-primary" />}
    />
  );
}