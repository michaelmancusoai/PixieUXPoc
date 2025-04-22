import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Calendar, MessageSquare, Phone, CreditCard, 
  Paperclip, MoreHorizontal, ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

const patientData = {
  name: "Sarah Johnson",
  dob: "28 Aug 1986 · 38 yrs",
  gender: "Female",
  chart: "Chart #12345",
  alerts: [
    { id: 1, type: "error", icon: "error", label: "Latex Allergy" },
    { id: 2, type: "warning", icon: "attach_money", label: "Outstanding Balance" }
  ]
};

export default function Header() {
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-1">
            <Link href="/patients">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Patients
              </Button>
            </Link>
          </div>
          
          <div>
            <Button variant="outline" className="flex items-center">
              Actions
              <MoreHorizontal className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function PatientCard() {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start mb-4">
          <Avatar className="h-14 w-14 mr-4 bg-[#F56A46]">
            <div className="w-full h-full rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold text-white">SJ</span>
            </div>
          </Avatar>
          
          <div>
            <h1 className="text-xl font-bold text-gray-700 mb-1">{patientData.name}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{patientData.dob}</span>
              <span>{patientData.gender}</span>
              <span>{patientData.chart}</span>
            </div>
          </div>
        </div>

        {/* Alert badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="destructive" className="flex items-center">
            <span className="mr-1 text-xs">⚠️</span>
            Latex Allergy
          </Badge>
          <Badge variant="outline" className="flex items-center bg-amber-500 text-white hover:bg-amber-600">
            <span className="mr-1 text-xs">💰</span>
            Outstanding Balance
          </Badge>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between mt-3 mb-2 px-1">
          <CircleActionButton icon={<Calendar className="h-4 w-4" />} label="Schedule" />
          <CircleActionButton icon={<MessageSquare className="h-4 w-4" />} label="Message" />  
          <CircleActionButton icon={<Phone className="h-4 w-4" />} label="Call" />
          <CircleActionButton icon={<CreditCard className="h-4 w-4" />} label="Payment" />
          <CircleActionButton icon={<Paperclip className="h-4 w-4" />} label="Attachment" />
        </div>
      </CardContent>
    </Card>
  );
}

function CircleActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1 hover:bg-gray-200 transition-colors cursor-pointer">
        <div className="text-gray-600">{icon}</div>
      </div>
      <span className="text-[10px] font-medium text-gray-700">{label}</span>
    </div>
  );
}

function ActionButton({ icon, label, tooltip }: { icon: React.ReactNode; label: string; tooltip: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center">
            {icon}
            {label}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}