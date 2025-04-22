import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Calendar, MessageSquare, Phone, CreditCard, 
  Paperclip, MoreHorizontal, ArrowLeft, MapPin
} from "lucide-react";
import { Link } from "wouter";
import { patientData } from "./data";

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

export interface PatientCardProps {
  patient?: any;
  medicalAlerts?: any[];
}

export function PatientCard({ patient, medicalAlerts = [] }: PatientCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Format the date of birth for display
  const formatDob = (dateOfBirth: string | Date) => {
    if (!dateOfBirth) return '';
    const date = new Date(dateOfBirth);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const age = new Date().getFullYear() - date.getFullYear();
    return `${formattedDate} · ${age} yrs`;
  };

  // If no patient data yet, use fallback data
  if (!patient) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="flex items-start mb-4">
              <div className="h-14 w-14 rounded-full bg-muted mr-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-6 bg-muted rounded w-24"></div>
              <div className="h-6 bg-muted rounded w-32"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const fullName = `${patient.firstName} ${patient.lastName}`;
  
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start mb-4">
          <Avatar className="h-14 w-14 mr-4 bg-[#F56A46]">
            <div className="w-full h-full rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold text-white">{getInitials(fullName)}</span>
            </div>
          </Avatar>
          
          <div>
            <h1 className="text-xl font-bold text-gray-700 mb-1">{fullName}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{formatDob(patient.dateOfBirth)}</span>
              <span>{patient.gender}</span>
              <span>Chart #{patient.chartNumber}</span>
            </div>
          </div>
        </div>

        {/* Alert badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {medicalAlerts && medicalAlerts.map((alert, index) => (
            <Badge 
              key={index}
              variant={alert.severity === 'high' ? "destructive" : "outline"}
              className={`flex items-center ${
                alert.severity === 'medium' ? 'bg-amber-500 text-white hover:bg-amber-600' : ''
              }`}
            >
              <span className="mr-1 text-xs">
                {alert.severity === 'high' ? '⚠️' : alert.severity === 'medium' ? '⚠️' : 'ℹ️'}
              </span>
              {alert.description}
            </Badge>
          ))}
          
          {/* If no medical alerts, show a default badge */}
          {(!medicalAlerts || medicalAlerts.length === 0) && (
            <Badge variant="outline" className="flex items-center bg-green-100 text-green-800 border-green-200">
              <span className="mr-1 text-xs">✓</span>
              No Medical Alerts
            </Badge>
          )}
        </div>
        
        {/* Patient details */}
        <div className="space-y-2 mb-4 text-sm">
          {patient.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">{patient.phone}</p>
              </div>
            </div>
          )}
          {patient.email && (
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">{patient.email}</p>
              </div>
            </div>
          )}
          {patient.address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="text-muted-foreground">
                <p>{patient.address}</p>
                {patient.city && patient.state && (
                  <p>{patient.city}, {patient.state} {patient.zipCode}</p>
                )}
              </div>
            </div>
          )}
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