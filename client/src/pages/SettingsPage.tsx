import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building, 
  Shield, 
  Calendar, 
  Activity, 
  Receipt, 
  MessageSquare, 
  Package, 
  Wallet, 
  RefreshCcw, 
  Cog, 
  CreditCard, 
  FileBarChart, 
  Users, 
  LockKeyhole, 
  Palette
} from "lucide-react";
import { useLocation } from "wouter";

export default function SettingsPage() {
  const [, navigate] = useLocation();

  const handleCardClick = (path: string) => {
    navigate(path);
  };
  
  // Define paths for settings cards
  const SETTINGS_PATHS = {
    practiceProfile: "/settings/practice-profile",
    scheduling: "/settings/scheduling",
    communications: "/settings/communications",
    practiceFinances: "/settings/practice-finances",
    teamMembers: "/settings/team-members",
    security: "/settings/security",
    accessLogs: "/settings/access-logs",
    userPermissions: "/settings/user-permissions",
    clinicalTemplates: "/settings/clinical-templates",
    inventory: "/settings/inventory",
    aiAutomation: "/settings/ai-automation",
    billingPayments: "/settings/billing-payments",
    feeSchedules: "/settings/fee-schedules-settings",
    subscription: "/settings/subscription",
    externalServices: "/settings/external-services",
    apiSettings: "/settings/api-settings",
    referralManagement: "/settings/referral-management",
    theme: "/settings/theme"
  };
  
  return (
    <NavigationWrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        {/* Practice Settings */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b pb-2">Practice</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <SettingsCard 
              title="Practice Profile" 
              description="Manage your practice information, locations, and contact details" 
              icon={Building}
              onClick={() => handleCardClick(SETTINGS_PATHS.practiceProfile)}
            />
            <SettingsCard 
              title="Scheduling" 
              description="Configure appointment types, durations, and availability" 
              icon={Calendar}
              onClick={() => handleCardClick(SETTINGS_PATHS.scheduling)}
            />
            <SettingsCard 
              title="Communications" 
              description="Set up automated reminders, notifications, and templates" 
              icon={MessageSquare}
              onClick={() => handleCardClick(SETTINGS_PATHS.communications)}
            />
            <SettingsCard 
              title="Practice Finances" 
              description="Manage financial settings, reports, and tax information" 
              icon={Wallet}
              onClick={() => handleCardClick(SETTINGS_PATHS.practiceFinances)}
            />
          </div>
        </div>
        
        {/* Users & Security Settings */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b pb-2">Users & Security</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <SettingsCard 
              title="Team Members" 
              description="Manage staff accounts, roles, and permissions" 
              icon={Users}
              onClick={() => handleCardClick(SETTINGS_PATHS.teamMembers)}
            />
            <SettingsCard 
              title="Security" 
              description="Configure security settings, 2FA, and session controls" 
              icon={Shield}
              onClick={() => handleCardClick(SETTINGS_PATHS.security)}
            />
            <SettingsCard 
              title="Access Logs" 
              description="View system access history and security events" 
              icon={FileBarChart}
              onClick={() => handleCardClick(SETTINGS_PATHS.accessLogs)}
            />
            <SettingsCard 
              title="User Permissions" 
              description="Set granular access controls for different user roles" 
              icon={LockKeyhole}
              onClick={() => handleCardClick(SETTINGS_PATHS.userPermissions)}
            />
          </div>
        </div>
        
        {/* Clinical Settings */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b pb-2">Clinical</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <SettingsCard 
              title="Clinical Templates" 
              description="Configure clinical notes, forms, and treatment plan templates" 
              icon={Activity}
              onClick={() => handleCardClick(SETTINGS_PATHS.clinicalTemplates)}
            />
            <SettingsCard 
              title="Inventory" 
              description="Manage supplies, equipment, and ordering thresholds" 
              icon={Package}
              onClick={() => handleCardClick(SETTINGS_PATHS.inventory)}
            />
            <SettingsCard 
              title="AI Automation" 
              description="Configure AI tools for clinical recommendations and workflow automation" 
              icon={RefreshCcw}
              onClick={() => handleCardClick(SETTINGS_PATHS.aiAutomation)}
            />
          </div>
        </div>
        
        {/* Billing Settings */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b pb-2">Billing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <SettingsCard 
              title="Billing & Payments" 
              description="Configure payment methods, processing, and auto-billing" 
              icon={Receipt}
              onClick={() => handleCardClick(SETTINGS_PATHS.billingPayments)}
            />
            <SettingsCard 
              title="Fee Schedules" 
              description="Manage procedure codes, fees, and insurance contracts" 
              icon={FileBarChart}
              onClick={() => handleCardClick(SETTINGS_PATHS.feeSchedules)}
            />
            <SettingsCard 
              title="Subscription" 
              description="Manage your Pixie Dental subscription and billing details" 
              icon={CreditCard}
              onClick={() => handleCardClick(SETTINGS_PATHS.subscription)}
            />
          </div>
        </div>
        
        {/* Appearance Settings */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold border-b pb-2">Appearance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <SettingsCard 
              title="Theme" 
              description="Customize colors, spacing, and visual elements to match your practice branding" 
              icon={Palette} 
              onClick={() => handleCardClick(SETTINGS_PATHS.theme)}
            />
          </div>
        </div>
        
        {/* Integrations Settings */}
        <div className="space-y-3 mb-6">
          <h2 className="text-xl font-semibold border-b pb-2">Integrations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <SettingsCard 
              title="External Services" 
              description="Connect with external services, labs, and referral networks" 
              icon={Cog}
              onClick={() => handleCardClick(SETTINGS_PATHS.externalServices)}
            />
            <SettingsCard 
              title="API Settings" 
              description="Manage API keys and external application access" 
              icon={Cog}
              onClick={() => handleCardClick(SETTINGS_PATHS.apiSettings)}
            />
            <SettingsCard 
              title="Referral Management" 
              description="Configure referral workflows and partner communications" 
              icon={Users}
              onClick={() => handleCardClick(SETTINGS_PATHS.referralManagement)}
            />
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
}

interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick?: () => void;
}

function SettingsCard({ title, description, icon: Icon, onClick }: SettingsCardProps) {
  return (
    <Card 
      className="hover:border-primary/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-3 p-3 pb-2">
        <div className="bg-primary/10 p-1.5 rounded-md flex-shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="text-xs leading-tight mt-0.5">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2 px-3">
        <div className="text-xs text-right text-muted-foreground">
          Configure →
        </div>
      </CardContent>
    </Card>
  );
}