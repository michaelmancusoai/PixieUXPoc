import { useLocation } from "wouter";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cog } from "lucide-react";

interface SettingsPageTemplateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function SettingsPageTemplate({ 
  title, 
  description,
  icon
}: SettingsPageTemplateProps) {
  const [, setLocation] = useLocation();

  return (
    <NavigationWrapper>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setLocation("/settings")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {icon}
                {title}
              </h1>
              <p className="text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            <Cog className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
        </div>
        
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
          <Cog className="h-16 w-16 text-muted-foreground/50 mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            This settings page is under development and will be available soon.
          </p>
        </div>
      </div>
    </NavigationWrapper>
  );
}