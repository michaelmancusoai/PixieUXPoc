import SettingsPageTemplate from "./SettingsPageTemplate";
import { Shield } from "lucide-react";

export default function SecuritySettingsPage() {
  return (
    <SettingsPageTemplate
      title="Security"
      description="Configure security settings, 2FA, and session controls"
      icon={<Shield className="h-5 w-5 text-primary" />}
    />
  );
}