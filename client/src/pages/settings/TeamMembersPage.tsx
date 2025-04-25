import SettingsPageTemplate from "./SettingsPageTemplate";
import { Users } from "lucide-react";

export default function TeamMembersPage() {
  return (
    <SettingsPageTemplate
      title="Team Members"
      description="Manage staff accounts, roles, and permissions"
      icon={<Users className="h-5 w-5 text-primary" />}
    />
  );
}