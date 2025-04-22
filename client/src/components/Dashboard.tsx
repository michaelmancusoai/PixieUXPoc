import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart3, PieChart, Users, Calendar, Receipt } from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              +5.1% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,842</div>
            <p className="text-xs text-muted-foreground">
              +12.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,512</div>
            <p className="text-xs text-muted-foreground">
              +3.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Appointments by Type</CardTitle>
            <CardDescription>
              Distribution of appointment types for the current month
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <PieChart className="h-32 w-32 text-gray-400 mb-4" />
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                    <span className="text-sm">Checkups (45%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
                    <span className="text-sm">Cleanings (30%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                    <span className="text-sm">Fillings (15%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                    <span className="text-sm">Other (10%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>
              Revenue trend for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center w-full px-4">
                <LineChart className="h-32 w-full text-gray-400 mb-4" />
                <div className="w-full flex justify-between text-xs text-gray-500">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Treatment Distribution</CardTitle>
          <CardDescription>
            Breakdown of treatments performed this quarter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center w-full px-8">
              <BarChart3 className="h-48 w-full text-gray-400 mb-4" />
              <div className="w-full flex justify-between text-xs text-gray-500">
                <span>Cleanings</span>
                <span>Fillings</span>
                <span>Root Canals</span>
                <span>Crowns</span>
                <span>Extractions</span>
                <span>Implants</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}