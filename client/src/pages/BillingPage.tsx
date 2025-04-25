import React, { useState } from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  FileText, 
  CreditCard, 
  Wallet, 
  BarChart3, 
  ArrowUpRight,
  AlertCircle,
  CheckCircle,
  ClipboardCheck,
  Banknote,
  Calendar,
  Clock,
  XCircle,
  Send,
  BadgePercent,
  RefreshCcw,
  AlertTriangle,
  FileCheck,
  ReceiptText,
  ChevronRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function BillingPage() {
  // To track confetti animation states
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRedHalo, setShowRedHalo] = useState(false);

  // Sample Data
  const currentTime = new Date();
  const isPastThreePM = currentTime.getHours() >= 15;

  // For demonstration purposes only
  // In a real app, these would come from the backend
  const unbilledProcedures = { count: 23, amount: 3780 };
  const draftClaims = { count: 5, amount: 2150 };
  const deniedClaims = { count: 3, amount: 940 };
  const agingPatients = { count: 14, amount: 1860 };
  const staleFeePlans = { count: 3, months: 18 };

  // Clear confetti after 3 seconds if shown
  React.useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <NavigationWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Billing & Finance</h1>
          {/* Today's date */}
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        
        {/* Hero Row: 4 action-oriented KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Unbilled Procedures Card */}
          <Card className="shadow-sm border-t-4 border-t-amber-300 flex flex-col">
            <CardHeader className="py-3 px-5 border-b bg-amber-50/50">
              <CardTitle className="text-base font-medium flex items-center">
                <FileCheck className="h-4 w-4 mr-2 text-amber-600" />
                Unbilled Procedures
              </CardTitle>
            </CardHeader>
            <CardContent className="py-5 px-5 flex-1 flex flex-col">
              <div>
                <div className="text-2xl font-bold flex items-center mb-1">
                  ${unbilledProcedures.amount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {unbilledProcedures.count} completed today
                </div>
                <div className="text-xs text-amber-700 mb-3">
                  Every day unfiled is a day revenue waits
                </div>
              </div>
              
              <div className="mt-auto">
                <Link href="/billing/claims">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full">
                    Create Claims
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Draft Claims Card */}
          <Card 
            className={`shadow-sm border-t-4 border-t-destructive/30 flex flex-col relative ${
              showRedHalo && isPastThreePM ? 'ring-2 ring-destructive ring-opacity-60 ring-offset-1' : ''
            }`}
          >
            <CardHeader className="py-3 px-5 border-b bg-destructive/5">
              <CardTitle className="text-base font-medium flex items-center">
                <Send className="h-4 w-4 mr-2 text-destructive" />
                Draft Claims
              </CardTitle>
            </CardHeader>
            <CardContent className="py-5 px-5 flex-1 flex flex-col">
              <div>
                <div className="text-2xl font-bold flex items-center mb-1">
                  {draftClaims.count > 0 ? (
                    <>
                      {draftClaims.count} claims · ${draftClaims.amount.toLocaleString()}
                    </>
                  ) : (
                    <>No drafts — breathe easy.</>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {draftClaims.count > 0 
                    ? "Dollars sitting in drafts queue" 
                    : "All claims submitted"
                  }
                </div>
                {isPastThreePM && draftClaims.count > 0 && (
                  <div className="text-xs text-destructive font-medium mb-3">
                    Send now to avoid an extra day's float
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
                <Link href="/billing/claims">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowRedHalo(true)}
                    disabled={draftClaims.count === 0}>
                    Send Claims
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Denied/Rejected Claims Card */}
          <Card 
            className={`shadow-sm border-t-4 flex flex-col ${
              deniedClaims.count === 0 && showConfetti ? 'border-t-green-300 bg-green-50/10' : 'border-t-amber-500'
            }`}
          >
            <CardHeader className={`py-3 px-5 border-b ${
              deniedClaims.count === 0 && showConfetti ? 'bg-green-50/50' : 'bg-amber-50/50'
            }`}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium flex items-center">
                  {deniedClaims.count === 0 && showConfetti ? (
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-600" />
                  )}
                  Denied / Rejected
                </CardTitle>
                {deniedClaims.count === 0 && showConfetti && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    All Clear ✓
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="py-5 px-5 flex-1 flex flex-col">
              <div>
                <div className="text-2xl font-bold flex items-center mb-1">
                  {deniedClaims.count > 0 ? (
                    <>
                      {deniedClaims.count} claims · ${deniedClaims.amount.toLocaleString()}
                    </>
                  ) : (
                    <>No denials today — cup of tea time ☕</>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {deniedClaims.count > 0 
                    ? "Payer said no — let's turn it into yes" 
                    : "You're all caught up"
                  }
                </div>
                {deniedClaims.count > 0 && (
                  <div className="text-xs text-amber-700 mb-3">
                    Fix now → cash in ≤ 7 days
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
                <Link href="/billing/claims">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowConfetti(true)}
                    disabled={deniedClaims.count === 0}>
                    Correct & Resubmit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Patient A/R Aging Card */}
          <Card className="shadow-sm border-t-4 border-t-orange-400 flex flex-col">
            <CardHeader className="py-3 px-5 border-b bg-orange-50/30">
              <CardTitle className="text-base font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-orange-600" />
                Patient A/R Aging &gt; 30d
              </CardTitle>
            </CardHeader>
            <CardContent className="py-5 px-5 flex-1 flex flex-col">
              <div>
                <div className="text-2xl font-bold flex items-center mb-1">
                  ${agingPatients.amount.toLocaleString()} ({agingPatients.count} pts)
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Balances aging — nudge before month-end
                </div>
                
                <div className="h-2 w-full bg-gray-100 rounded-full mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-300 to-red-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${(agingPatients.amount / 3000) * 100}%` }}>
                  </div>
                </div>
                <div className="text-xs text-orange-700 mb-3">
                  Balances at risk of collections fees
                </div>
              </div>
              
              <div className="mt-auto">
                <Link href="/billing/statements">
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full">
                    Send Statements
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Revenue Radar Strip */}
        <div className="bg-blue-50/50 px-6 py-4 rounded-lg border shadow-sm">
          <div className="mb-2 text-sm font-medium text-blue-700">Revenue Radar — Forecast Month-End</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="group cursor-help">
                    <div className="text-sm text-muted-foreground mb-1">On-track $</div>
                    <div className="text-xl font-bold text-green-600 group-hover:underline">$22,840</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">Expected revenue from clean claims that should be paid on normal schedule.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="group cursor-help">
                    <div className="text-sm text-muted-foreground mb-1">At-risk $</div>
                    <div className="text-xl font-bold text-amber-600 group-hover:underline">$4,950</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">Revenue that may be delayed due to pending claim issues or patient aging balances.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="group cursor-help">
                    <div className="text-sm text-muted-foreground mb-1">Stalled $</div>
                    <div className="text-xl font-bold text-red-600 group-hover:underline">$1,860</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">Revenue unlikely to be collected this month due to denials, pre-auth issues, or aging &gt; 90 days.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="group cursor-help">
                    <div className="text-sm text-muted-foreground mb-1">Won back $</div>
                    <div className="text-xl font-bold text-blue-600 group-hover:underline">$2,310</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">Previously at-risk revenue recovered through denial appeals, payment plans, or collections efforts.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Role-Smart Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Today's Claim Tasks Card */}
          <Card className="shadow-sm border flex flex-col">
            <CardHeader className="py-3 px-5 border-b bg-slate-50/50">
              <CardTitle className="text-base font-medium flex items-center">
                <ClipboardCheck className="h-4 w-4 mr-2 text-slate-600" />
                Today's Claim Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4 px-5 flex-1 flex flex-col">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Draft claims</div>
                  <Badge variant="outline" className="font-medium">
                    {draftClaims.count}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Denial re-submits</div>
                  <Badge variant="outline" className="font-medium">
                    {deniedClaims.count}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Payer follow-ups</div>
                  <Badge variant="outline" className="font-medium">
                    7
                  </Badge>
                </div>
              </div>
              
              <div className="mt-auto">
                <Link href="/billing/claims">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full">
                    Open Claim Queue
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Today's Payment Tasks Card */}
          <Card className="shadow-sm border flex flex-col">
            <CardHeader className="py-3 px-5 border-b bg-slate-50/50">
              <CardTitle className="text-base font-medium flex items-center">
                <Banknote className="h-4 w-4 mr-2 text-slate-600" />
                Today's Payment Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4 px-5 flex-1 flex flex-col">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Unpaid checkouts</div>
                  <Badge variant="outline" className="font-medium">
                    4
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Today's collections</div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                    $1,280
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Payment plans due</div>
                  <Badge variant="outline" className="font-medium">
                    3
                  </Badge>
                </div>
              </div>
              
              <div className="mt-auto">
                <Link href="/billing/payments">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full">
                    Unpaid Check-outs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Fee-Schedule Alerts Card */}
          <Card className="shadow-sm border flex flex-col">
            <CardHeader className="py-3 px-5 border-b bg-slate-50/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium flex items-center">
                  <BadgePercent className="h-4 w-4 mr-2 text-slate-600" />
                  Fee-Schedule Alerts
                </CardTitle>
                {staleFeePlans.count > 0 && staleFeePlans.months >= 18 && (
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                    Outdated
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="py-4 px-5 flex-1 flex flex-col">
              <div className="space-y-3 mb-4">
                {staleFeePlans.count > 0 && staleFeePlans.months >= 18 && (
                  <div className="text-xs text-amber-700 mb-3">
                    Out-of-date fees cost ~8% revenue
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="text-sm">Plans &gt; 18 mo old</div>
                  <Badge variant="outline" className={`font-medium ${staleFeePlans.count > 0 ? "text-amber-700" : ""}`}>
                    {staleFeePlans.count}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Under-priced codes</div>
                  <Badge variant="outline" className="font-medium text-amber-700">
                    12
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Contract renewals</div>
                  <Badge variant="outline" className="font-medium">
                    1
                  </Badge>
                </div>
              </div>
              
              <div className="mt-auto">
                <Link href="/billing/fee-schedules">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full">
                    Review Fees
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Today's Statement Tasks Card */}
          <Card className="shadow-sm border flex flex-col">
            <CardHeader className="py-3 px-5 border-b bg-slate-50/50">
              <CardTitle className="text-base font-medium flex items-center">
                <ReceiptText className="h-4 w-4 mr-2 text-slate-600" />
                Today's Statement Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4 px-5 flex-1 flex flex-col">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Statements awaiting first reminder</div>
                  <Badge variant="outline" className="font-medium">
                    16
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">30-day follow-ups needed</div>
                  <Badge variant="outline" className="font-medium text-amber-700">
                    9
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">60-day statements to call</div>
                  <Badge variant="outline" className="font-medium text-amber-700">
                    5
                  </Badge>
                </div>
              </div>
              
              <div className="mt-auto">
                <Link href="/billing/statements">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full">
                    Send Reminders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Collections Watch Card */}
          <Card className="shadow-sm border flex flex-col">
            <CardHeader className="py-3 px-5 border-b bg-slate-50/50">
              <CardTitle className="text-base font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-slate-600" />
                Collections Watch
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4 px-5 flex-1 flex flex-col">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Aging &gt; 90 days</div>
                  <Badge variant="outline" className="font-medium text-red-700">
                    $3,420
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Already in collections (fees rising)</div>
                  <Badge variant="outline" className="font-medium">
                    10 accounts
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">At risk accounts</div>
                  <Badge variant="outline" className="font-medium text-amber-700">
                    8
                  </Badge>
                </div>
              </div>
              
              <div className="mt-auto">
                <Link href="/billing/collections">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full">
                    View Over 90d
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </NavigationWrapper>
  );
}