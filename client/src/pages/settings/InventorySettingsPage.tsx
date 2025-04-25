import SettingsPageTemplate from "@/pages/settings/SettingsPageTemplate";
import { Package } from "lucide-react";

export default function InventorySettingsPage() {
  return (
    <SettingsPageTemplate
      title="Inventory"
      description="Manage supplies, equipment, and ordering thresholds"
      icon={<Package className="h-5 w-5" />}
    />
  );
}