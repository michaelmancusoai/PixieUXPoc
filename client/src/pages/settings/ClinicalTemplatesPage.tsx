import SettingsPageTemplate from "@/pages/settings/SettingsPageTemplate";
import { Activity } from "lucide-react";

export default function ClinicalTemplatesPage() {
  return (
    <SettingsPageTemplate
      title="Clinical Templates"
      description="Configure clinical notes, forms, and treatment plan templates"
      icon={<Activity className="h-5 w-5" />}
    />
  );
}