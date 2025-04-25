import SettingsPageTemplate from "@/pages/settings/SettingsPageTemplate";
import { Receipt } from "lucide-react";

export default function BillingPaymentsPage() {
  return (
    <SettingsPageTemplate
      title="Billing & Payments"
      description="Configure payment methods, processing, and auto-billing"
      icon={<Receipt className="h-5 w-5" />}
    />
  );
}