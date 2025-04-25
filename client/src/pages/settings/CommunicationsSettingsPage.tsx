import SettingsPageTemplate from "./SettingsPageTemplate";
import { MessageSquare } from "lucide-react";

export default function CommunicationsSettingsPage() {
  return (
    <SettingsPageTemplate
      title="Communications"
      description="Set up automated reminders, notifications, and templates"
      icon={<MessageSquare className="h-5 w-5 text-primary" />}
    />
  );
}