import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import CircleActionButton from "@/components/shared/ui/CircleActionButton";
import { Calendar, MessageSquare, Phone, CreditCard, Paperclip } from "lucide-react";
import { useParams } from "wouter";
import { usePatientDetails, useMedicalAlerts } from "@/hooks/patient";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Format a date to a human-readable string
 */
function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Generate initials from a name (first letter of first and last name)
 */
function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return 'UU';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'UU';
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * PatientCard - Displays patient information and action buttons
 */
export default function PatientCard() {
  const params = useParams<{ id: string }>();
  const patientId = params.id ? parseInt(params.id) : 0;
  
  // Fetch patient data and medical alerts
  const { data: patient, isLoading: isLoadingPatient } = usePatientDetails(patientId);
  const { data: medicalAlerts, isLoading: isLoadingAlerts } = useMedicalAlerts(patientId);
  
  // Loading state
  if (isLoadingPatient || !patient) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-start mb-4">
            <Skeleton className="h-14 w-14 rounded-full mr-4" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="flex justify-between mt-3 mb-2 px-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-12 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate age
  let age = 0;
  try {
    if (patient.dateOfBirth) {
      const birthDate = new Date(patient.dateOfBirth);
      const ageDiff = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDiff);
      age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }
  } catch (error) {
    console.error('Error calculating age:', error);
  }
  
  // Format patient info for display
  const firstName = patient.firstName || 'Unknown';
  const lastName = patient.lastName || 'Patient';
  const patientName = `${firstName} ${lastName}`;
  const dobDisplay = patient.dateOfBirth ? `${age} years (${formatDate(patient.dateOfBirth)})` : 'No DOB';
  const chartDisplay = patient.chartNumber ? `Chart #${patient.chartNumber}` : 'No Chart #';
  const initials = getInitials(patientName);
  
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start mb-4">
          <Avatar className="h-14 w-14 mr-4 bg-[#F56A46]">
            <div className="w-full h-full rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold text-white">{initials}</span>
            </div>
          </Avatar>
          
          <div>
            <h1 className="text-xl font-bold text-gray-700 mb-1">{patientName}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{dobDisplay}</span>
              <span>{patient.gender || 'Unknown'}</span>
              <span>{chartDisplay}</span>
            </div>
          </div>
        </div>

        {/* Alert badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {isLoadingAlerts ? (
            <>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-36" />
            </>
          ) : medicalAlerts && medicalAlerts.length > 0 ? (
            medicalAlerts.map((alert) => (
              <Badge 
                key={alert.id} 
                variant={alert.severity === 'High' ? "destructive" : "outline"}
                className={alert.severity !== 'High' ? "bg-amber-500 text-white hover:bg-amber-600" : ""}
              >
                {alert.description}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No medical alerts</span>
          )}
          
          {/* Show outstanding balance alert if applicable */}
          <Badge variant="outline" className="flex items-center bg-amber-500 text-white hover:bg-amber-600">
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