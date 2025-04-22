import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Shield, Calendar, Activity, Receipt, MessageSquare, Package, Wallet, RefreshCcw, Cog, CreditCard, FileBarChart, Users, LockKeyhole } from "lucide-react";

export default function SettingsPage() {
  return (
    <NavigationWrapper>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        {/* Practice Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SettingsCard 
              title="Practice Profile" 
              description="Manage your practice information, locations, and contact details" 
              icon={Building} 
            />
            <SettingsCard 
              title="Scheduling" 
              description="Configure appointment types, durations, and availability" 
              icon={Calendar} 
            />
            <SettingsCard 
              title="Communications" 
              description="Set up automated reminders, notifications, and templates" 
              icon={MessageSquare} 
            />
            <SettingsCard 
              title="Practice Finances" 
              description="Manage financial settings, reports, and tax information" 
              icon={Wallet} 
            />
          </div>
        </div>
        
        {/* Users & Security Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Users & Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SettingsCard 
              title="Team Members" 
              description="Manage staff accounts, roles, and permissions" 
              icon={Users} 
            />
            <SettingsCard 
              title="Security" 
              description="Configure security settings, 2FA, and session controls" 
              icon={Shield} 
            />
            <SettingsCard 
              title="Access Logs" 
              description="View system access history and security events" 
              icon={FileBarChart} 
            />
            <SettingsCard 
              title="User Permissions" 
              description="Set granular access controls for different user roles" 
              icon={LockKeyhole} 
            />
          </div>
        </div>
        
        {/* Clinical Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Clinical</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SettingsCard 
              title="Clinical Templates" 
              description="Configure clinical notes, forms, and treatment plan templates" 
              icon={Activity} 
            />
            <SettingsCard 
              title="Inventory" 
              description="Manage supplies, equipment, and ordering thresholds" 
              icon={Package} 
            />
            <SettingsCard 
              title="AI Automation" 
              description="Configure AI tools for clinical recommendations and workflow automation" 
              icon={RefreshCcw} 
            />
          </div>
        </div>
        
        {/* Billing Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Billing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SettingsCard 
              title="Billing & Payments" 
              description="Configure payment methods, processing, and auto-billing" 
              icon={Receipt} 
            />
            <SettingsCard 
              title="Fee Schedules" 
              description="Manage procedure codes, fees, and insurance contracts" 
              icon={FileBarChart} 
            />
            <SettingsCard 
              title="Subscription" 
              description="Manage your Pixie Dental subscription and billing details" 
              icon={CreditCard} 
            />
          </div>
        </div>
        
        {/* Integrations Settings */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold border-b pb-2">Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SettingsCard 
              title="External Services" 
              description="Connect with external services, labs, and referral networks" 
              icon={Cog} 
            />
            <SettingsCard 
              title="API Settings" 
              description="Manage API keys and external application access" 
              icon={Cog} 
            />
            <SettingsCard 
              title="Referral Management" 
              description="Configure referral workflows and partner communications" 
              icon={Users} 
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
}

function SettingsCard({ title, description, icon: Icon }: SettingsCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-primary/10 p-2 rounded-md">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-right text-muted-foreground">
          Configure →
        </div>
      </CardContent>
    </Card>
  );
}