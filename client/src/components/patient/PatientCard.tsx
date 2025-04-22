import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import CircleActionButton from "@/components/shared/ui/CircleActionButton";
import { Calendar, MessageSquare, Phone, CreditCard, Paperclip } from "lucide-react";

interface PatientData {
  name: string;
  dob: string;
  gender: string;
  chart: string;
  alerts: Array<{
    id: number;
    type: string;
    label: string;
  }>;
}

const patientData: PatientData = {
  name: "Sarah Jackson",
  dob: "43 years (05/12/1981)",
  gender: "Female",
  chart: "Chart #PT-5678",
  alerts: [
    { id: 1, type: "danger", label: "Latex Allergy" },
    { id: 2, type: "warning", label: "Outstanding Balance" }
  ]
};

/**
 * PatientCard - Displays patient information and action buttons
 */
export default function PatientCard() {
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
            Latex Allergy
          </Badge>
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