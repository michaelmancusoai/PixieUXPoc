import SettingsPageTemplate from "@/pages/settings/SettingsPageTemplate";
import { Cog } from "lucide-react";

export default function ExternalServicesPage() {
  return (
    <SettingsPageTemplate
      title="External Services"
      description="Connect with external services, labs, and referral networks"
      icon={<Cog className="h-5 w-5" />}
    />
  );
}