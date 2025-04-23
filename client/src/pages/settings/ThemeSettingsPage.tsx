import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { useTheme, ThemeSettings } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  Palette,
  RotateCcw
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Helper to convert HSL string to separate values
function parseHslValue(hslString: string): { h: number, s: number, l: number } {
  const [h, s, l] = hslString.split(' ').map(value => parseFloat(value));
  return { 
    h: h || 0, 
    s: parseFloat(s?.toString() || '0') || 0, 
    l: parseFloat(l?.toString() || '0') || 0 
  };
}

// Helper to format HSL values back to string
function formatHslValue(h: number, s: number, l: number): string {
  return `${h} ${s}% ${l}%`;
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const { h, s, l } = parseHslValue(value);
  
  const [hue, setHue] = useState(h);
  const [saturation, setSaturation] = useState(s);
  const [lightness, setLightness] = useState(l);

  useEffect(() => {
    const { h, s, l } = parseHslValue(value);
    setHue(h);
    setSaturation(s);
    setLightness(l);
  }, [value]);

  const handleHueChange = (newHue: number[]) => {
    setHue(newHue[0]);
    onChange(formatHslValue(newHue[0], saturation, lightness));
  };

  const handleSaturationChange = (newSaturation: number[]) => {
    setSaturation(newSaturation[0]);
    onChange(formatHslValue(hue, newSaturation[0], lightness));
  };

  const handleLightnessChange = (newLightness: number[]) => {
    setLightness(newLightness[0]);
    onChange(formatHslValue(hue, saturation, newLightness[0]));
  };

  const colorStyle = {
    backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-md border" 
            style={colorStyle} 
          />
          <div className="text-sm text-muted-foreground">
            HSL({hue}, {saturation}%, {lightness}%)
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Hue</span>
            <span>{hue}°</span>
          </div>
          <Slider 
            value={[hue]} 
            min={0} 
            max={360} 
            step={1} 
            onValueChange={handleHueChange}
            className="hue-slider"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Saturation</span>
            <span>{saturation}%</span>
          </div>
          <Slider 
            value={[saturation]} 
            min={0} 
            max={100} 
            step={1} 
            onValueChange={handleSaturationChange}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Lightness</span>
            <span>{lightness}%</span>
          </div>
          <Slider 
            value={[lightness]} 
            min={0} 
            max={100} 
            step={1} 
            onValueChange={handleLightnessChange}
          />
        </div>
      </div>
    </div>
  );
}

export default function ThemeSettingsPage() {
  const [, setLocation] = useLocation();
  const { theme, darkMode, setTheme, setDarkMode, resetTheme } = useTheme();
  const [localTheme, setLocalTheme] = useState<ThemeSettings>({ ...theme });
  const [activeTab, setActiveTab] = useState("core");
  const [previewDarkMode, setPreviewDarkMode] = useState(darkMode);

  useEffect(() => {
    setLocalTheme({ ...theme });
  }, [theme]);

  // Update the theme when darkMode changes for preview
  useEffect(() => {
    if (previewDarkMode !== darkMode) {
      setDarkMode(previewDarkMode);
    }
  }, [previewDarkMode, darkMode, setDarkMode]);

  const handleSave = () => {
    setTheme(localTheme);
  };

  const handleReset = () => {
    resetTheme();
    setLocalTheme({ ...theme });
  };

  const handlePropertyChange = (key: keyof ThemeSettings, value: string) => {
    setLocalTheme(prev => ({ ...prev, [key]: value }));
  };

  return (
    <NavigationWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setLocation("/settings")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Theme Settings</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            
            <Button 
              onClick={handleSave}
              size="sm"
              className="flex items-center gap-2"
            >
              <Palette className="h-4 w-4" />
              Save Theme
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-md">
              {previewDarkMode ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-medium">Appearance Mode</h3>
              <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
            </div>
          </div>
          
          <Switch
            checked={previewDarkMode}
            onCheckedChange={setPreviewDarkMode}
          />
        </div>
        
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 grid grid-cols-4">
                <TabsTrigger value="core">Core Colors</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="core" className="space-y-6">
                <ColorPicker
                  label="Primary Color"
                  value={localTheme.primary}
                  onChange={(value) => handlePropertyChange("primary", value)}
                />
                
                <ColorPicker
                  label="Primary Dark"
                  value={localTheme.primaryDark}
                  onChange={(value) => handlePropertyChange("primaryDark", value)}
                />
                
                <ColorPicker
                  label="Primary Foreground"
                  value={localTheme.primaryForeground}
                  onChange={(value) => handlePropertyChange("primaryForeground", value)}
                />
                
                <ColorPicker
                  label="Secondary Color"
                  value={localTheme.secondary}
                  onChange={(value) => handlePropertyChange("secondary", value)}
                />
                
                <ColorPicker
                  label="Secondary Foreground"
                  value={localTheme.secondaryForeground}
                  onChange={(value) => handlePropertyChange("secondaryForeground", value)}
                />
                
                <ColorPicker
                  label="Background"
                  value={localTheme.background}
                  onChange={(value) => handlePropertyChange("background", value)}
                />
                
                <ColorPicker
                  label="Foreground"
                  value={localTheme.foreground}
                  onChange={(value) => handlePropertyChange("foreground", value)}
                />
              </TabsContent>
              
              <TabsContent value="components" className="space-y-6">
                <ColorPicker
                  label="Card Background"
                  value={localTheme.card}
                  onChange={(value) => handlePropertyChange("card", value)}
                />
                
                <ColorPicker
                  label="Card Foreground"
                  value={localTheme.cardForeground}
                  onChange={(value) => handlePropertyChange("cardForeground", value)}
                />
                
                <ColorPicker
                  label="Accent"
                  value={localTheme.accent}
                  onChange={(value) => handlePropertyChange("accent", value)}
                />
                
                <ColorPicker
                  label="Accent Foreground"
                  value={localTheme.accentForeground}
                  onChange={(value) => handlePropertyChange("accentForeground", value)}
                />
                
                <ColorPicker
                  label="Muted"
                  value={localTheme.muted}
                  onChange={(value) => handlePropertyChange("muted", value)}
                />
                
                <ColorPicker
                  label="Muted Foreground"
                  value={localTheme.mutedForeground}
                  onChange={(value) => handlePropertyChange("mutedForeground", value)}
                />
                
                <ColorPicker
                  label="Border"
                  value={localTheme.border}
                  onChange={(value) => handlePropertyChange("border", value)}
                />
                
                <ColorPicker
                  label="Input"
                  value={localTheme.input}
                  onChange={(value) => handlePropertyChange("input", value)}
                />
                
                <ColorPicker
                  label="Ring"
                  value={localTheme.ring}
                  onChange={(value) => handlePropertyChange("ring", value)}
                />
                
                <ColorPicker
                  label="Destructive"
                  value={localTheme.destructive}
                  onChange={(value) => handlePropertyChange("destructive", value)}
                />
                
                <ColorPicker
                  label="Destructive Foreground"
                  value={localTheme.destructiveForeground}
                  onChange={(value) => handlePropertyChange("destructiveForeground", value)}
                />
                
                <div className="space-y-4">
                  <Label>Border Radius</Label>
                  <Input
                    value={localTheme.radius}
                    onChange={(e) => handlePropertyChange("radius", e.target.value)}
                    placeholder="0.5rem"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="sidebar" className="space-y-6">
                <ColorPicker
                  label="Sidebar Background"
                  value={localTheme.sidebarBackground}
                  onChange={(value) => handlePropertyChange("sidebarBackground", value)}
                />
                
                <ColorPicker
                  label="Sidebar Foreground"
                  value={localTheme.sidebarForeground}
                  onChange={(value) => handlePropertyChange("sidebarForeground", value)}
                />
                
                <ColorPicker
                  label="Sidebar Primary"
                  value={localTheme.sidebarPrimary}
                  onChange={(value) => handlePropertyChange("sidebarPrimary", value)}
                />
                
                <ColorPicker
                  label="Sidebar Primary Foreground"
                  value={localTheme.sidebarPrimaryForeground}
                  onChange={(value) => handlePropertyChange("sidebarPrimaryForeground", value)}
                />
                
                <ColorPicker
                  label="Sidebar Accent"
                  value={localTheme.sidebarAccent}
                  onChange={(value) => handlePropertyChange("sidebarAccent", value)}
                />
                
                <ColorPicker
                  label="Sidebar Accent Foreground"
                  value={localTheme.sidebarAccentForeground}
                  onChange={(value) => handlePropertyChange("sidebarAccentForeground", value)}
                />
                
                <ColorPicker
                  label="Sidebar Border"
                  value={localTheme.sidebarBorder}
                  onChange={(value) => handlePropertyChange("sidebarBorder", value)}
                />
              </TabsContent>
              
              <TabsContent value="charts" className="space-y-6">
                <ColorPicker
                  label="Chart Color 1"
                  value={localTheme.chart1}
                  onChange={(value) => handlePropertyChange("chart1", value)}
                />
                
                <ColorPicker
                  label="Chart Color 2"
                  value={localTheme.chart2}
                  onChange={(value) => handlePropertyChange("chart2", value)}
                />
                
                <ColorPicker
                  label="Chart Color 3"
                  value={localTheme.chart3}
                  onChange={(value) => handlePropertyChange("chart3", value)}
                />
                
                <ColorPicker
                  label="Chart Color 4"
                  value={localTheme.chart4}
                  onChange={(value) => handlePropertyChange("chart4", value)}
                />
                
                <ColorPicker
                  label="Chart Color 5"
                  value={localTheme.chart5}
                  onChange={(value) => handlePropertyChange("chart5", value)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-3 pb-6">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/settings")}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </NavigationWrapper>
  );
}