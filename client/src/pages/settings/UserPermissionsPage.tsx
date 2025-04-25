import SettingsPageTemplate from "@/pages/settings/SettingsPageTemplate";
import { LockKeyhole } from "lucide-react";

export default function UserPermissionsPage() {
  return (
    <SettingsPageTemplate
      title="User Permissions"
      description="Set granular access controls for different user roles"
      icon={<LockKeyhole className="h-5 w-5" />}
    />
  );
}