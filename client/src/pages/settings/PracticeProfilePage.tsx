import SettingsPageTemplate from "./SettingsPageTemplate";
import { Building } from "lucide-react";

export default function PracticeProfilePage() {
  return (
    <SettingsPageTemplate
      title="Practice Profile"
      description="Manage your practice information, locations, and contact details"
      icon={<Building className="h-5 w-5 text-primary" />}
    />
  );
}