import SettingsPageTemplate from "@/pages/settings/SettingsPageTemplate";
import { Wallet } from "lucide-react";

export default function PracticeFinancesPage() {
  return (
    <SettingsPageTemplate
      title="Practice Finances"
      description="Manage financial settings, reports, and tax information"
      icon={<Wallet className="h-5 w-5" />}
    />
  );
}