import React from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, AreaChart, PieChart, Activity, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <NavigationWrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Reports Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Access various reports to analyze practice performance, track key metrics, and make data-driven decisions.
              Choose from financial, clinical, operational, and other report categories below.
            </p>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <LineChart className="mr-2 h-5 w-5 text-primary" />
                Financial Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1 pl-1">
                <li>Revenue by Provider</li>
                <li>Production vs Collections</li>
                <li>Accounts Receivable Aging</li>
                <li>Insurance Claims Analysis</li>
              </ul>
              <Button variant="outline" size="sm">Generate Report</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Clinical Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1 pl-1">
                <li>Procedure Frequency</li>
                <li>Treatment Plan Acceptance</li>
                <li>Clinical Outcomes</li>
                <li>Diagnosis Analytics</li>
              </ul>
              <Button variant="outline" size="sm">Generate Report</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <AreaChart className="mr-2 h-5 w-5 text-primary" />
                Operational Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1 pl-1">
                <li>Scheduling Efficiency</li>
                <li>Chair Utilization</li>
                <li>Appointment Analytics</li>
                <li>Staff Productivity</li>
              </ul>
              <Button variant="outline" size="sm">Generate Report</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Patient Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1 pl-1">
                <li>New Patient Analytics</li>
                <li>Patient Demographics</li>
                <li>Recall Effectiveness</li>
                <li>Patient Retention</li>
              </ul>
              <Button variant="outline" size="sm">Generate Report</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Package className="mr-2 h-5 w-5 text-primary" />
                Inventory Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1 pl-1">
                <li>Supply Usage</li>
                <li>Inventory Valuation</li>
                <li>Order Tracking</li>
                <li>Expiration Monitoring</li>
              </ul>
              <Button variant="outline" size="sm">Generate Report</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-primary" />
                Custom Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create customized reports tailored to your specific practice needs and metrics.
              </p>
              <Button variant="outline" size="sm">Create Custom Report</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </NavigationWrapper>
  );
}