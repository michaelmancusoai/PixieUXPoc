import SettingsPageTemplate from "./SettingsPageTemplate";
import { RefreshCcw } from "lucide-react";

export default function AIAutomationPage() {
  return (
    <SettingsPageTemplate
      title="AI Automation"
      description="Configure AI tools for clinical recommendations and workflow automation"
      icon={<RefreshCcw className="h-5 w-5 text-primary" />}
    />
  );
}