import SettingsPageTemplate from "./SettingsPageTemplate";
import { Users } from "lucide-react";

export default function ReferralManagementPage() {
  return (
    <SettingsPageTemplate
      title="Referral Management"
      description="Configure referral workflows and partner communications"
      icon={<Users className="h-5 w-5 text-primary" />}
    />
  );
}