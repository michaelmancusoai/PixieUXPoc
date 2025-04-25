import React, { useState, useEffect } from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Calendar,
  ChevronRight,
  Clock,
  LineChart,
  Info,
  TrendingDown,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
  UserX,
  XCircle,
  Users,
  DollarSign,
  Activity,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import JSConfetti from 'js-confetti';
import { useLocation } from "wouter";

// Types
type TimeWindow = "3m" | "6m" | "12m" | "custom";
type InsightCard = {
  id: number;
  type: "spike" | "conversion" | "recall" | "general";
  title: string;
  description: string;
  cta: string;
  ctaPath: string;
  timestamp: string;
  viewed: boolean;
  pulsing: boolean;
};

// Mock data generator
const generateMockData = () => {
  // Active patients data
  const activePatientCount = 1486;
  const activePatientGrowthRate = 1.9;
  const activePatientSparkline = [1450, 1458, 1463, 1459, 1465, 1472, 1475, 1479, 1481, 1484, 1486];
  
  // New patients data
  const newPatientsMTD = 27;
  const newPatientsGoal = 40;
  const newPatientsProgress = (newPatientsMTD / newPatientsGoal) * 100;
  const newPatientsSparkline = [4, 6, 9, 12, 15, 18, 21, 23, 25, 27];
  
  // Dormant patients data
  const dormantPatientCount = 102;
  const dormantPatientChange = -4;
  const dormantPatientSparkline = [112, 110, 108, 106, 107, 108, 106, 104, 103, 102];
  
  // Hygiene re-appointment rate
  const hygieneReAppointRate = 87;
  const hygieneReAppointTarget = 90;
  const hygieneReAppointSparkline = [82, 83, 85, 84, 86, 85, 86, 87, 87, 87];
  
  // Patient flow funnel (last 12 months)
  const patientFlowFunnel = [
    { month: 'Apr', new: 35, active: 1450, dormant: 98, lost: 12 },
    { month: 'May', new: 32, active: 1458, dormant: 97, lost: 14 },
    { month: 'Jun', new: 29, active: 1463, dormant: 95, lost: 16 },
    { month: 'Jul', new: 27, active: 1459, dormant: 99, lost: 15 },
    { month: 'Aug', new: 30, active: 1465, dormant: 101, lost: 13 },
    { month: 'Sep', new: 33, active: 1472, dormant: 103, lost: 11 },
    { month: 'Oct', new: 31, active: 1475, dormant: 105, lost: 14 },
    { month: 'Nov', new: 30, active: 1479, dormant: 107, lost: 16 },
    { month: 'Dec', new: 29, active: 1481, dormant: 105, lost: 15 },
    { month: 'Jan', new: 31, active: 1484, dormant: 104, lost: 12 },
    { month: 'Feb', new: 28, active: 1486, dormant: 102, lost: 24 },
    { month: 'Mar', new: 33, active: 1486, dormant: 102, lost: 14 }
  ];
  
  // Production per active patient (last 12 months)
  const industryAverage = 750;
  const productionPerPatient = [
    { month: 'Apr', value: 790, industry: industryAverage },
    { month: 'May', value: 805, industry: industryAverage },
    { month: 'Jun', value: 780, industry: industryAverage },
    { month: 'Jul', value: 795, industry: industryAverage },
    { month: 'Aug', value: 810, industry: industryAverage },
    { month: 'Sep', value: 825, industry: industryAverage },
    { month: 'Oct', value: 815, industry: industryAverage },
    { month: 'Nov', value: 805, industry: industryAverage },
    { month: 'Dec', value: 785, industry: industryAverage },
    { month: 'Jan', value: 800, industry: industryAverage },
    { month: 'Feb', value: 815, industry: industryAverage },
    { month: 'Mar', value: 830, industry: industryAverage }
  ];
  
  // Recall compliance heatmap
  const recallHeatmap = [
    { month: 'Oct', within2w: 65, within4w: 75, within8w: 82 },
    { month: 'Nov', within2w: 70, within4w: 78, within8w: 85 },
    { month: 'Dec', within2w: 62, within4w: 72, within8w: 80 },
    { month: 'Jan', within2w: 68, within4w: 77, within8w: 84 },
    { month: 'Feb', within2w: 71, within4w: 80, within8w: 87 },
    { month: 'Mar', within2w: 63, within4w: 73, within8w: 81 },
    { month: 'Apr', within2w: 67, within4w: 76, within8w: 83 },
    { month: 'May', within2w: 72, within4w: 81, within8w: 88 },
    { month: 'Jun', within2w: 58, within4w: 64, within8w: 54 },
    { month: 'Jul', within2w: 64, within4w: 74, within8w: 82 },
    { month: 'Aug', within2w: 69, within4w: 79, within8w: 86 },
    { month: 'Sep', within2w: 73, within4w: 82, within8w: 89 }
  ];
  
  // Insights
  const insights: InsightCard[] = [
    {
      id: 1,
      type: "spike",
      title: "Spike in Lost Patients",
      description: "February saw 24 patients move to Lost—largest in 9 months.",
      cta: "View Lost Reasons",
      ctaPath: "/patients/segments?status=lost",
      timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      viewed: false,
      pulsing: true
    },
    {
      id: 2,
      type: "conversion",
      title: "Low Conversion Source",
      description: "Facebook ads convert at 22% vs average 41%.",
      cta: "See Leads",
      ctaPath: "/patients/prospects?source=facebook",
      timestamp: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      viewed: true,
      pulsing: false
    },
    {
      id: 3,
      type: "recall",
      title: "Recall Slippage",
      description: "June recall cohort only 54% booked.",
      cta: "Recall List",
      ctaPath: "/schedule/recalls?month=june",
      timestamp: new Date().toISOString(),
      viewed: false,
      pulsing: false
    }
  ];
  
  return {
    activePatientCount,
    activePatientGrowthRate,
    activePatientSparkline,
    newPatientsMTD,
    newPatientsGoal,
    newPatientsProgress,
    newPatientsSparkline,
    dormantPatientCount,
    dormantPatientChange,
    dormantPatientSparkline,
    hygieneReAppointRate,
    hygieneReAppointTarget,
    hygieneReAppointSparkline,
    patientFlowFunnel,
    productionPerPatient,
    recallHeatmap,
    insights
  };
};

// Helper function to generate a sparkline SVG
const generateSparkline = (data: number[], color: string, height: number = 30, width: number = 100): string => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <polyline 
        points="${points}" 
        fill="none" 
        stroke="${color}" 
        stroke-width="1.5"
      />
    </svg>
  `;
};

// Helper function to determine KPI tile colors
const getTileColorClasses = (
  type: "active" | "new" | "dormant" | "hygiene", 
  value: number, 
  threshold1: number, 
  threshold2?: number
): { borderColor: string; bgColor: string } => {
  if (type === "active") {
    // For active patients, positive growth is good (mint), negative is bad (coral)
    if (value > 0) return { borderColor: "border-t-emerald-400", bgColor: "bg-emerald-50/50" };
    if (value < 0) return { borderColor: "border-t-red-400", bgColor: "bg-red-50/50" };
    return { borderColor: "border-t-gray-300", bgColor: "bg-gray-50" };
  }
  
  if (type === "new") {
    // For new patients, measured against goal
    const percentage = value;
    if (percentage >= 100) return { borderColor: "border-t-emerald-400", bgColor: "bg-emerald-50/50" };
    if (percentage >= 75) return { borderColor: "border-t-amber-400", bgColor: "bg-amber-50/50" };
    return { borderColor: "border-t-red-400", bgColor: "bg-red-50/50" };
  }
  
  if (type === "dormant") {
    // For dormant patients, fewer is better
    if (value <= 75) return { borderColor: "border-t-emerald-400", bgColor: "bg-emerald-50/50" };
    if (value <= 150) return { borderColor: "border-t-amber-400", bgColor: "bg-amber-50/50" };
    return { borderColor: "border-t-red-400", bgColor: "bg-red-50/50" };
  }
  
  if (type === "hygiene") {
    // For hygiene reappointment rate
    if (value >= 90) return { borderColor: "border-t-emerald-400", bgColor: "bg-emerald-50/50" };
    if (value >= 80) return { borderColor: "border-t-amber-400", bgColor: "bg-amber-50/50" };
    return { borderColor: "border-t-red-400", bgColor: "bg-red-50/50" };
  }
  
  return { borderColor: "border-t-gray-300", bgColor: "bg-gray-50" };
};

// Helper function to format numbers
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

export default function PatientMetricsPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // State
  const [mockData, setMockData] = useState(() => generateMockData());
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("12m");
  const [provider, setProvider] = useState("all");
  const [source, setSource] = useState("all");
  const [insights, setInsights] = useState<InsightCard[]>(mockData.insights);
  
  // Show confetti effect if hygiene rate crosses 90%
  useEffect(() => {
    if (mockData.hygieneReAppointRate >= 90) {
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        emojis: ['✅', '🎉'],
        confettiNumber: 50,
      });
      
      toast({
        title: "Goal Achieved!",
        description: "Hygiene re-appointment rate has crossed 90%!"
      });
    }
  }, [mockData.hygieneReAppointRate]);
  
  // Handle insight card click
  const handleInsightClick = (insightId: number, ctaPath: string) => {
    // Mark as viewed
    const updatedInsights = insights.map(insight => 
      insight.id === insightId 
        ? { ...insight, viewed: true, pulsing: false } 
        : insight
    );
    setInsights(updatedInsights);
    
    // Navigate to the path
    navigate(ctaPath);
  };
  
  // Get active patient tile colors
  const activePatientColors = getTileColorClasses(
    "active", 
    mockData.activePatientGrowthRate, 
    0
  );
  
  // Get new patients tile colors
  const newPatientColors = getTileColorClasses(
    "new", 
    mockData.newPatientsProgress, 
    75, 
    100
  );
  
  // Get dormant patients tile colors
  const dormantPatientColors = getTileColorClasses(
    "dormant", 
    mockData.dormantPatientCount, 
    75, 
    150
  );
  
  // Get hygiene re-appointment rate tile colors
  const hygieneColors = getTileColorClasses(
    "hygiene", 
    mockData.hygieneReAppointRate, 
    80, 
    90
  );
  
  return (
    <NavigationWrapper>
      <div className="min-h-screen bg-muted/40">
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Patient Metrics</h1>
          </div>
          
          {/* Hero KPI Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Active Patient Base Tile */}
            <Card 
              className={`shadow-sm border-t-4 ${activePatientColors.borderColor} flex flex-col cursor-pointer`}
              onClick={() => navigate("/patients/directory")}
            >
              <CardHeader className={`py-3 px-4 border-b ${activePatientColors.bgColor}`}>
                <CardTitle className="text-base font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-slate-600" />
                  Active Patient Base
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Active = visited in last 18 m. Industry median 1,650.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4 px-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold">
                      {formatNumber(mockData.activePatientCount)} patients
                    </div>
                    <div className="text-sm flex items-center">
                      <span className={mockData.activePatientGrowthRate > 0 ? "text-emerald-600" : "text-red-600"}>
                        {mockData.activePatientGrowthRate > 0 ? "+" : ""}{mockData.activePatientGrowthRate}% MoM
                      </span>
                      <span className="mx-1">•</span>
                      <span className="text-muted-foreground">seen ≤ 18 m</span>
                    </div>
                  </div>
                  <div 
                    className="h-7 w-[100px]"
                    dangerouslySetInnerHTML={{ 
                      __html: generateSparkline(
                        mockData.activePatientSparkline, 
                        mockData.activePatientGrowthRate > 0 ? '#10b981' : '#ef4444'
                      ) 
                    }}
                  />
                </div>
                <div className="mt-auto">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/patients/directory");
                    }}
                  >
                    View Directory
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* New Patients MTD Tile */}
            <Card 
              className={`shadow-sm border-t-4 ${newPatientColors.borderColor} flex flex-col cursor-pointer`}
              onClick={() => navigate("/patients/prospects")}
            >
              <CardHeader className={`py-3 px-4 border-b ${newPatientColors.bgColor}`}>
                <CardTitle className="text-base font-medium flex items-center">
                  <UserPlus className="h-4 w-4 mr-2 text-slate-600" />
                  New Patients MTD
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4 px-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold flex items-end">
                      {mockData.newPatientsMTD} new 
                      <span className="text-sm text-muted-foreground ml-1 mb-0.5">(goal {mockData.newPatientsGoal})</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full mt-2 mb-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          mockData.newPatientsProgress >= 100 ? 'bg-emerald-500' : 
                          mockData.newPatientsProgress >= 75 ? 'bg-amber-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(mockData.newPatientsProgress, 100)}%` }}>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(mockData.newPatientsProgress)}% of monthly goal
                    </div>
                  </div>
                  <div 
                    className="h-7 w-[100px]"
                    dangerouslySetInnerHTML={{ 
                      __html: generateSparkline(
                        mockData.newPatientsSparkline, 
                        mockData.newPatientsProgress >= 75 ? '#10b981' : '#ef4444'
                      ) 
                    }}
                  />
                </div>
                <div className="mt-auto">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/patients/prospects");
                    }}
                  >
                    See Source Mix
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Dormant Patients Tile */}
            <Card 
              className={`shadow-sm border-t-4 ${dormantPatientColors.borderColor} flex flex-col cursor-pointer`}
              onClick={() => navigate("/patients/segments?status=dormant")}
            >
              <CardHeader className={`py-3 px-4 border-b ${dormantPatientColors.bgColor}`}>
                <CardTitle className="text-base font-medium flex items-center">
                  <UserX className="h-4 w-4 mr-2 text-slate-600" />
                  Dormant 18-36 m
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4 px-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold">
                      {mockData.dormantPatientCount} patients
                    </div>
                    <div className="text-sm flex items-center">
                      <span className={mockData.dormantPatientChange < 0 ? "text-emerald-600" : "text-red-600"}>
                        {mockData.dormantPatientChange >= 0 ? "+" : ""}{mockData.dormantPatientChange} vs last month
                      </span>
                    </div>
                  </div>
                  <div 
                    className="h-7 w-[100px]"
                    dangerouslySetInnerHTML={{ 
                      __html: generateSparkline(
                        mockData.dormantPatientSparkline, 
                        mockData.dormantPatientChange < 0 ? '#10b981' : '#ef4444'
                      ) 
                    }}
                  />
                </div>
                <div className="mt-auto">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/patients/segments?status=dormant");
                    }}
                  >
                    Reactivate List
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Hygiene Re-Appointment Rate Tile */}
            <Card 
              className={`shadow-sm border-t-4 ${hygieneColors.borderColor} flex flex-col cursor-pointer`}
              onClick={() => navigate("/schedule/recalls")}
            >
              <CardHeader className={`py-3 px-4 border-b ${hygieneColors.bgColor}`}>
                <CardTitle className="text-base font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-slate-600" />
                  Hygiene Re-Appt Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4 px-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold flex items-end">
                      {mockData.hygieneReAppointRate}% last 6 m
                      <span className="text-sm text-muted-foreground ml-1 mb-0.5">(target {mockData.hygieneReAppointTarget}%)</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full mt-2 mb-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          mockData.hygieneReAppointRate >= 90 ? 'bg-emerald-500' : 
                          mockData.hygieneReAppointRate >= 80 ? 'bg-amber-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(mockData.hygieneReAppointRate, 100)}%` }}>
                      </div>
                    </div>
                  </div>
                  <div 
                    className="h-7 w-[100px]"
                    dangerouslySetInnerHTML={{ 
                      __html: generateSparkline(
                        mockData.hygieneReAppointSparkline, 
                        mockData.hygieneReAppointRate >= 80 ? '#10b981' : '#ef4444'
                      ) 
                    }}
                  />
                </div>
                <div className="mt-auto">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/schedule/recalls");
                    }}
                  >
                    Book Recalls
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Trend Canvas - 3/4 width */}
            <div className="lg:col-span-3">
              <Card className="shadow-sm">
                <CardHeader className="py-4 px-6 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-medium">Patient Trends</CardTitle>
                  <div className="flex gap-3">
                    <Select value={timeWindow} onValueChange={(value) => setTimeWindow(value as TimeWindow)}>
                      <SelectTrigger className="w-[100px] h-8">
                        <SelectValue placeholder="Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3m">3 Months</SelectItem>
                        <SelectItem value="6m">6 Months</SelectItem>
                        <SelectItem value="12m">12 Months</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={provider} onValueChange={setProvider}>
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue placeholder="Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Providers</SelectItem>
                        <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                        <SelectItem value="dr-jones">Dr. Jones</SelectItem>
                        <SelectItem value="hygienist-amy">Amy (Hygienist)</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={source} onValueChange={setSource}>
                      <SelectTrigger className="w-[110px] h-8">
                        <SelectValue placeholder="Source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="web">Web</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="ppo">PPO List</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pt-2 pb-6">
                  <Tabs defaultValue="funnel" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="funnel" className="flex items-center">
                        <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                        Patient Flow Funnel
                      </TabsTrigger>
                      <TabsTrigger value="production" className="flex items-center">
                        <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                        Production per Patient
                      </TabsTrigger>
                      <TabsTrigger value="heatmap" className="flex items-center">
                        <Activity className="h-3.5 w-3.5 mr-1.5" />
                        Recall Compliance
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="funnel" className="mt-0">
                      {/* Patient Flow Funnel Chart Placeholder */}
                      <div className="bg-muted/30 rounded-md flex items-center justify-center p-8 h-[300px]">
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            Patient Flow Funnel Chart would be displayed here
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Columns: New → Active → Dormant → Lost
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="production" className="mt-0">
                      {/* Production per Patient Chart Placeholder */}
                      <div className="bg-muted/30 rounded-md flex items-center justify-center p-8 h-[300px]">
                        <div className="text-center">
                          <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            Production per Active Patient Chart would be displayed here
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Grey baseline = Industry average (ADA)
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="heatmap" className="mt-0">
                      {/* Recall Compliance Heatmap Placeholder */}
                      <div className="bg-muted/30 rounded-md flex items-center justify-center p-8 h-[300px]">
                        <div className="text-center">
                          <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            Recall Compliance Cohort Heatmap would be displayed here
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Rows = Month patient was due • Columns = % booked within timeframe
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="px-6 py-4 border-t flex justify-between">
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/patients/segments?status=new")}
                    >
                      New pts list
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/patients/segments?status=dormant")}
                    >
                      Dormant list
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/schedule/recalls")}
                    >
                      Recall due list
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/patients/segments?status=lost")}
                    >
                      Lost reasons
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            {/* Insights Side Panel - 1/4 width */}
            <div className="lg:col-span-1">
              <Card className="shadow-sm">
                <CardHeader className="py-4 px-5 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-medium">Insights</CardTitle>
                  <Badge variant="outline" className="text-xs">{insights.length}</Badge>
                </CardHeader>
                <CardContent className="px-5 pt-0 pb-4">
                  <div className="space-y-3">
                    {insights.map(insight => (
                      <Card 
                        key={insight.id} 
                        className={`shadow-sm border ${insight.pulsing ? 'border-amber-300 animate-pulse' : ''}`}
                      >
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-sm font-medium flex items-center">
                            {insight.type === "spike" && <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-red-500" />}
                            {insight.type === "conversion" && <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-amber-500" />}
                            {insight.type === "recall" && <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-500" />}
                            {insight.type === "general" && <Info className="h-3.5 w-3.5 mr-1.5 text-gray-500" />}
                            {insight.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-1 px-4">
                          <p className="text-sm text-muted-foreground">{insight.description}</p>
                        </CardContent>
                        <CardFooter className="py-2 px-4">
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="p-0 h-auto text-sm"
                            onClick={() => handleInsightClick(insight.id, insight.ctaPath)}
                          >
                            {insight.cta}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    
                    {insights.length === 0 && (
                      <div className="text-center py-8">
                        <Check className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                        <p className="text-sm text-muted-foreground">All clear! No issues to report.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </NavigationWrapper>
  );
}