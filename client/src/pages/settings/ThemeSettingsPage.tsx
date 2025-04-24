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
// Convert HSL to HEX
function hslToHex(h: number, s: number, l: number): string {
  // Convert HSL to RGB
  s /= 100;
  l /= 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function parseHslValue(hslString: string): { h: number, s: number, l: number } {
  // Handle hex color input
  if (hslString.startsWith('#')) {
    const r = parseInt(hslString.slice(1, 3), 16) / 255;
    const g = parseInt(hslString.slice(3, 5), 16) / 255;
    const b = parseInt(hslString.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    
    let h = 0, s = 0;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return { 
      h: Math.round(h * 360), 
      s: Math.round(s * 100), 
      l: Math.round(l * 100) 
    };
  }
  
  // Handle HSL format
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
  const [hexValue, setHexValue] = useState(hslToHex(h, s, l));

  useEffect(() => {
    const { h, s, l } = parseHslValue(value);
    setHue(h);
    setSaturation(s);
    setLightness(l);
    setHexValue(hslToHex(h, s, l));
  }, [value]);

  const handleHueChange = (newHue: number[]) => {
    setHue(newHue[0]);
    const newValue = formatHslValue(newHue[0], saturation, lightness);
    setHexValue(hslToHex(newHue[0], saturation, lightness));
    onChange(newValue);
  };

  const handleSaturationChange = (newSaturation: number[]) => {
    setSaturation(newSaturation[0]);
    const newValue = formatHslValue(hue, newSaturation[0], lightness);
    setHexValue(hslToHex(hue, newSaturation[0], lightness));
    onChange(newValue);
  };

  const handleLightnessChange = (newLightness: number[]) => {
    setLightness(newLightness[0]);
    const newValue = formatHslValue(hue, saturation, newLightness[0]);
    setHexValue(hslToHex(hue, saturation, newLightness[0]));
    onChange(newValue);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setHexValue(newHex);
    
    // Only process valid hex colors
    if (/^#[0-9A-F]{6}$/i.test(newHex)) {
      onChange(newHex);
    }
  };

  const colorStyle = {
    backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        {label && <Label>{label}</Label>}
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-md border" 
            style={colorStyle} 
          />
          <div className="flex gap-2 items-center">
            <Input 
              value={hexValue}
              onChange={handleHexChange}
              className="w-24 h-8 text-xs font-mono"
            />
            <div className="text-xs text-muted-foreground hidden sm:block">
              HSL({hue}, {saturation}%, {lightness}%)
            </div>
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

// Function to derive secondary colors from primary
function deriveThemeColors(primaryColor: string, secondaryColor: string): Partial<ThemeSettings> {
  const primary = parseHslValue(primaryColor);
  const secondary = parseHslValue(secondaryColor);
  
  const derived: Partial<ThemeSettings> = {
    primary: primaryColor,
    secondary: secondaryColor,
    
    // Derive primary variations
    primaryDark: formatHslValue(primary.h, primary.s, Math.max(0, primary.l - 6)),
    primaryForeground: formatHslValue(primary.h, Math.min(10, primary.s), 99),
    
    // Derive secondary variations
    secondaryForeground: formatHslValue(secondary.h, Math.min(10, secondary.s), 10),
    
    // Derive accent
    accent: formatHslValue(primary.h, Math.min(100, primary.s), 95),
    accentForeground: formatHslValue(primary.h, Math.min(100, primary.s), 10),
    
    // Chart colors - create a palette based on primary and secondary
    chart1: primaryColor,
    chart2: secondaryColor,
    chart3: formatHslValue((primary.h + 15) % 360, Math.min(85, primary.s), Math.min(70, primary.l + 15)),
    chart4: formatHslValue((secondary.h + 20) % 360, Math.min(80, secondary.s), Math.min(75, secondary.l + 5)),
    chart5: formatHslValue((primary.h + 30) % 360, Math.min(90, primary.s), Math.min(65, primary.l + 10)),
    
    // Sidebar colors
    sidebarPrimary: primaryColor,
    sidebarPrimaryForeground: formatHslValue(primary.h, Math.min(10, primary.s), 99),
    sidebarAccent: formatHslValue(primary.h, Math.min(50, primary.s), 95),
    sidebarAccentForeground: primaryColor,
    sidebarRing: primaryColor,
    
    // Ring based on primary
    ring: primaryColor,
  };
  
  return derived;
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
  }
  
  // Handle primary and secondary color change with derivation
  const handlePrimaryColorChange = (value: string) => {
    const derivedColors = deriveThemeColors(value, localTheme.secondary);
    setLocalTheme(prev => ({ ...prev, ...derivedColors }));
  }
  
  const handleSecondaryColorChange = (value: string) => {
    const derivedColors = deriveThemeColors(localTheme.primary, value);
    setLocalTheme(prev => ({ ...prev, ...derivedColors }));
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
        
        {/* Quick Theme Configuration Section */}
        <Card className="bg-muted/10 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Quick Theme Generator</h3>
                  <p className="text-sm text-muted-foreground">
                    Set your primary and secondary colors to automatically configure your entire theme palette
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    {previewDarkMode ? (
                      <Moon className="h-5 w-5 text-primary" />
                    ) : (
                      <Sun className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <Switch
                    checked={previewDarkMode}
                    onCheckedChange={setPreviewDarkMode}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <Label className="text-base">Primary Color</Label>
                    <p className="text-sm text-muted-foreground">
                      Used for buttons, links, and primary UI elements
                    </p>
                  </div>
                  <ColorPicker
                    label=""
                    value={localTheme.primary}
                    onChange={handlePrimaryColorChange}
                  />
                </div>
                
                <div>
                  <div className="mb-4">
                    <Label className="text-base">Secondary Color</Label>
                    <p className="text-sm text-muted-foreground">
                      Used for accents, highlights, and secondary UI elements
                    </p>
                  </div>
                  <ColorPicker
                    label=""
                    value={localTheme.secondary}
                    onChange={handleSecondaryColorChange}
                  />
                </div>
              </div>
              
              <div className="pt-4 flex items-center justify-center">
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className="w-8 h-8 rounded-full border"
                        style={{ 
                          backgroundColor: `hsl(${i === 0 
                            ? localTheme.primary 
                            : i === 1 
                              ? localTheme.secondary 
                              : i === 2 
                                ? localTheme.chart3 
                                : i === 3 
                                  ? localTheme.chart4 
                                  : localTheme.chart5})` 
                        }}
                      />
                      <span className="text-xs mt-1 text-muted-foreground">
                        {i === 0 ? 'Primary' : i === 1 ? 'Secondary' : `Color ${i+1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 grid grid-cols-7">
                <TabsTrigger value="core">Colors</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="shapes">Shapes</TabsTrigger>
                <TabsTrigger value="motion">Motion</TabsTrigger>
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
              
              <TabsContent value="typography" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Font Family</Label>
                    <Input
                      value={localTheme.fontFamily}
                      onChange={(e) => handlePropertyChange("fontFamily", e.target.value)}
                      placeholder="'Inter', sans-serif"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Font Size</Label>
                    <Input
                      value={localTheme.fontSize}
                      onChange={(e) => handlePropertyChange("fontSize", e.target.value)}
                      placeholder="16px"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Line Height</Label>
                    <Input
                      value={localTheme.lineHeight}
                      onChange={(e) => handlePropertyChange("lineHeight", e.target.value)}
                      placeholder="1.5"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Font Weight Light</Label>
                      <Input
                        value={localTheme.fontWeightLight}
                        onChange={(e) => handlePropertyChange("fontWeightLight", e.target.value)}
                        placeholder="300"
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Font Weight Regular</Label>
                      <Input
                        value={localTheme.fontWeightRegular}
                        onChange={(e) => handlePropertyChange("fontWeightRegular", e.target.value)}
                        placeholder="400"
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Font Weight Medium</Label>
                      <Input
                        value={localTheme.fontWeightMedium}
                        onChange={(e) => handlePropertyChange("fontWeightMedium", e.target.value)}
                        placeholder="500"
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Font Weight Bold</Label>
                      <Input
                        value={localTheme.fontWeightBold}
                        onChange={(e) => handlePropertyChange("fontWeightBold", e.target.value)}
                        placeholder="700"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="layout" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Base Spacing</Label>
                    <Input
                      value={localTheme.spacing}
                      onChange={(e) => handlePropertyChange("spacing", e.target.value)}
                      placeholder="8px"
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">The base spacing unit used throughout the application</p>
                  </div>
                  
                  <div>
                    <Label>Border Radius</Label>
                    <Input
                      value={localTheme.borderRadius}
                      onChange={(e) => handlePropertyChange("borderRadius", e.target.value)}
                      placeholder="4px"
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Default border radius for elements</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="shapes" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Small Shadow</Label>
                    <Input
                      value={localTheme.shadowSm}
                      onChange={(e) => handlePropertyChange("shadowSm", e.target.value)}
                      placeholder="0 1px 2px 0 rgb(0 0 0 / 0.05)"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Medium Shadow</Label>
                    <Input
                      value={localTheme.shadowMd}
                      onChange={(e) => handlePropertyChange("shadowMd", e.target.value)}
                      placeholder="0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Large Shadow</Label>
                    <Input
                      value={localTheme.shadowLg}
                      onChange={(e) => handlePropertyChange("shadowLg", e.target.value)}
                      placeholder="0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Extra Large Shadow</Label>
                    <Input
                      value={localTheme.shadowXl}
                      onChange={(e) => handlePropertyChange("shadowXl", e.target.value)}
                      placeholder="0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                      className="mt-2"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="motion" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Transition Duration</Label>
                    <Input
                      value={localTheme.transitionDuration}
                      onChange={(e) => handlePropertyChange("transitionDuration", e.target.value)}
                      placeholder="150ms"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Ease Timing Function</Label>
                    <Input
                      value={localTheme.transitionTimingEase}
                      onChange={(e) => handlePropertyChange("transitionTimingEase", e.target.value)}
                      placeholder="cubic-bezier(0.4, 0, 0.2, 1)"
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Default timing function for transitions</p>
                  </div>
                  
                  <div>
                    <Label>In Timing Function</Label>
                    <Input
                      value={localTheme.transitionTimingIn}
                      onChange={(e) => handlePropertyChange("transitionTimingIn", e.target.value)}
                      placeholder="cubic-bezier(0.0, 0, 0.2, 1)"
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Timing function for elements entering the screen</p>
                  </div>
                  
                  <div>
                    <Label>Out Timing Function</Label>
                    <Input
                      value={localTheme.transitionTimingOut}
                      onChange={(e) => handlePropertyChange("transitionTimingOut", e.target.value)}
                      placeholder="cubic-bezier(0.4, 0, 1, 1)"
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Timing function for elements leaving the screen</p>
                  </div>
                </div>
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