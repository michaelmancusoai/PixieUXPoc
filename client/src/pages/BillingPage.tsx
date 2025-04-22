import React from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, CreditCard, Wallet, BarChart3, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  return (
    <NavigationWrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Billing & Finance</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">$24,350</CardTitle>
              <CardDescription>Monthly Revenue</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs text-green-600 font-medium flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+8.2% from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">$5,830</CardTitle>
              <CardDescription>Outstanding Claims</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs text-muted-foreground">12 pending claims</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">$12,640</CardTitle>
              <CardDescription>Patient AR Balance</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs text-muted-foreground">28 patients with balance</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">$3,420</CardTitle>
              <CardDescription>Collections</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs text-amber-600 font-medium flex items-center">
                <span>10 accounts in collections</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Insurance Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Manage and track insurance claims.</p>
              <Button variant="outline" size="sm">View Claims</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Process and record patient payments.</p>
              <Button variant="outline" size="sm">Manage Payments</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Statements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Generate and send patient statements.</p>
              <Button variant="outline" size="sm">Create Statement</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-primary" />
                Collections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Manage accounts in collections.</p>
              <Button variant="outline" size="sm">View Collections</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Fee Schedules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">View and update procedure fee schedules.</p>
              <Button variant="outline" size="sm">Manage Fees</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Financial Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Run financial performance reports.</p>
              <Button variant="outline" size="sm">Generate Reports</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </NavigationWrapper>
  );
}