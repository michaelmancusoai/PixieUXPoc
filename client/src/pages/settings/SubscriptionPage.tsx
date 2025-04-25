import SettingsPageTemplate from "@/pages/settings/SettingsPageTemplate";
import { CreditCard } from "lucide-react";

export default function SubscriptionPage() {
  return (
    <SettingsPageTemplate
      title="Subscription"
      description="Manage your Pixie Dental subscription and billing details"
      icon={<CreditCard className="h-5 w-5" />}
    />
  );
}