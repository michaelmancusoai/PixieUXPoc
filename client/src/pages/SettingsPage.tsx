import { useState } from "react";
import { Header } from "@/components/Header";
import { HorizontalNavigation } from "@/components/HorizontalNavigation";
import { VerticalNavigation } from "@/components/VerticalNavigation";
import { CombinedNavigation } from "@/components/CombinedNavigation";
import { TabNavigation } from "@/components/TabNavigation";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Shield, Calendar, Activity, Receipt, MessageSquare, Package, Wallet, RefreshCcw, Cog, CreditCard, FileBarChart, Users } from "lucide-react";

export default function SettingsPage() {
  const [navStyle, setNavStyle] = useState(1);

  const renderNavigation = () => {
    switch (navStyle) {
      case 1:
        return <HorizontalNavigation />;
      case 2:
        return <VerticalNavigation />;
      case 3:
        return <CombinedNavigation />;
      case 4:
        return <TabNavigation />;
      default:
        return <HorizontalNavigation />;
    }
  };

  const isVerticalOrCombined = navStyle === 2 || navStyle === 3;

  return (
    <div className="flex flex-col h-screen">
      <Header currentNavStyle={navStyle} onChangeNavStyle={setNavStyle} />

      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`nav-container-${navStyle}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={isVerticalOrCombined ? "flex" : "flex flex-col w-full"}
          >
            {renderNavigation()}
          </motion.div>
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto p-6 bg-[#F5F7FA]">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            
            <Tabs defaultValue="practice" className="w-full">
              <TabsList className="mb-6 border-b w-full justify-start rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="practice" 
                  className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Practice
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Users & Security
                </TabsTrigger>
                <TabsTrigger 
                  value="clinical" 
                  className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Clinical
                </TabsTrigger>
                <TabsTrigger 
                  value="billing" 
                  className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Billing
                </TabsTrigger>
                <TabsTrigger 
                  value="integrations" 
                  className="py-3 px-5 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Integrations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="practice" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
              </TabsContent>

              <TabsContent value="clinical" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </TabsContent>

              <TabsContent value="billing" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </TabsContent>

              <TabsContent value="integrations" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SettingsCard 
                    title="Integrations" 
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
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