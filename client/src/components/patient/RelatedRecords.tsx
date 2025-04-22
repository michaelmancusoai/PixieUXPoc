import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ToothDiagram from "./ToothDiagram";
import {
  FileClock, FileText, CalendarDays, Stethoscope, 
  Folder, Users, ImagePlus, FlaskRound, CreditCard, File,
  Plus, Upload, UserPlus, Eye, DownloadCloud, Calendar,
  ChevronDown, Map
} from "lucide-react";

export default function RelatedRecords() {
  return (
    <Card>
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-lg font-medium">Related Records</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <Accordion type="multiple" className="w-full">
          <AccordionSection 
            id="claims" 
            title="Insurance Claims" 
            icon={<FileClock className="h-4 w-4" />}
            count={2}
          >
            <div className="space-y-2">
              <RecordItem 
                title="Annual Check-up Claim" 
                date="Apr 02, 2025"
                status="Approved"
                statusVariant="success"
              />
              <RecordItem 
                title="Follow-up Visit Claim" 
                date="Feb 15, 2025"
                status="Approved"
                statusVariant="success"
              />
            </div>
          </AccordionSection>
          
          <AccordionSection 
            id="treatment" 
            title="Treatment Plans" 
            icon={<Stethoscope className="h-4 w-4" />}
            count={1}
          >
            <div className="space-y-2">
              <RecordItem 
                title="Comprehensive Dental Care" 
                date="Apr 02, 2025"
                status="Active"
                statusVariant="info"
                description="Regular cleanings, cavity treatment, and orthodontic evaluation."
              />
            </div>
          </AccordionSection>
          
          <AccordionSection 
            id="family" 
            title="Family Members" 
            icon={<Users className="h-4 w-4" />}
            count={2}
          >
            <div className="space-y-2">
              <RecordItem 
                title="John Johnson" 
                date="Spouse"
                status="Patient"
                statusVariant="secondary"
              />
              <RecordItem 
                title="Emma Johnson" 
                date="Child"
                status="Patient"
                statusVariant="secondary"
              />
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
              <UserPlus className="h-3 w-3 mr-1" />
              Add Family Member
            </Button>
          </AccordionSection>
          
          <AccordionSection 
            id="documents" 
            title="Documents" 
            icon={<FileText className="h-4 w-4" />}
            count={3}
          >
            <div className="space-y-2">
              <RecordItem 
                title="Insurance Card" 
                date="Jan 15, 2025"
                status="PDF"
                statusVariant="secondary"
                actionIcon={<DownloadCloud className="h-3.5 w-3.5" />}
              />
              <RecordItem 
                title="Medical History Form" 
                date="Jan 15, 2025"
                status="PDF"
                statusVariant="secondary"
                actionIcon={<DownloadCloud className="h-3.5 w-3.5" />}
              />
              <RecordItem 
                title="HIPAA Consent" 
                date="Jan 15, 2025"
                status="PDF"
                statusVariant="secondary"
                actionIcon={<DownloadCloud className="h-3.5 w-3.5" />}
              />
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
              <Upload className="h-3 w-3 mr-1" />
              Upload Document
            </Button>
          </AccordionSection>
          
          <AccordionSection 
            id="imaging" 
            title="Imaging & X-Rays" 
            icon={<ImagePlus className="h-4 w-4" />}
            count={1}
          >
            <div className="text-center py-2">
              <ToothDiagram highlightedTooth={14} />
              <p className="text-xs text-muted-foreground mt-2">
                Tooth #14 - Crown placement (Apr 02, 2025)
              </p>
            </div>
          </AccordionSection>
          
          <AccordionSection 
            id="labs" 
            title="Lab Work" 
            icon={<FlaskRound className="h-4 w-4" />}
            count={0}
          >
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No lab records found</p>
              <Button variant="outline" size="sm" className="mt-2 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Request Lab Work
              </Button>
            </div>
          </AccordionSection>
        </Accordion>
      </CardContent>
    </Card>
  );
}

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  count: number;
}

function AccordionSection({ id, title, icon, children, count }: AccordionSectionProps) {
  return (
    <AccordionItem value={id} className="border-b">
      <AccordionTrigger className="py-3 px-4 hover:no-underline hover:bg-muted/30">
        <div className="flex items-center">
          <span className="mr-2 text-muted-foreground">{icon}</span>
          <span>{title}</span>
          {count > 0 && (
            <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground">
              {count}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 py-2">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

interface RecordItemProps {
  title: string;
  date: string;
  status?: string;
  statusVariant?: "success" | "warning" | "error" | "info" | "secondary";
  description?: string;
  actionIcon?: React.ReactNode;
}

function RecordItem({ 
  title, 
  date, 
  status, 
  statusVariant = "secondary",
  description,
  actionIcon
}: RecordItemProps) {
  const getVariantClass = () => {
    switch(statusVariant) {
      case "success": return "bg-green-100 text-green-800 border-green-200";
      case "warning": return "bg-amber-100 text-amber-800 border-amber-200";
      case "error": return "bg-red-100 text-red-800 border-red-200";
      case "info": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  return (
    <div className="flex items-start justify-between py-1.5 hover:bg-muted/20 px-1 rounded">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm text-gray-900 truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
        {description && (
          <p className="text-xs text-gray-700 mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center ml-2">
        {status && (
          <Badge variant="outline" className={`mr-1 text-xs ${getVariantClass()}`}>
            {status}
          </Badge>
        )}
        {actionIcon && (
          <Button variant="ghost" size="icon" className="h-6 w-6">
            {actionIcon}
          </Button>
        )}
      </div>
    </div>
  );
}