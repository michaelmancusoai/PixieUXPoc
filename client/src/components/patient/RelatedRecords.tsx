import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  File, Clock, Stethoscope, PlusCircle, 
  ArrowUpRight, X, FileText
} from "lucide-react";
import {
  usePatientDocuments,
  usePatientTreatments,
} from "@/hooks/usePatientDetails";

interface RelatedRecordsProps {
  patientId: number;
}

export default function RelatedRecords({ patientId }: RelatedRecordsProps) {
  const { data: documents, isLoading: isLoadingDocuments } = usePatientDocuments(patientId);
  const { data: treatments, isLoading: isLoadingTreatments } = usePatientTreatments(patientId);
  
  const isLoading = isLoadingDocuments || isLoadingTreatments;
  
  return (
    <Card className="h-full">
      <CardHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Related Records</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[620px]">
          <div className="p-4">
            <h3 className="font-medium text-sm mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-1 text-blue-600" />
              Documents & Files
            </h3>
            
            {isLoadingDocuments ? (
              <div className="space-y-2 mb-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}
              </div>
            ) : documents && documents.length > 0 ? (
              <div className="space-y-2 mb-6">
                {documents.map((doc) => (
                  <DocumentItem key={doc.id} document={doc} />
                ))}
              </div>
            ) : (
              <div className="text-sm text-center p-4 text-muted-foreground mb-6">
                No documents found
              </div>
            )}
            
            <h3 className="font-medium text-sm mb-2 flex items-center">
              <Stethoscope className="h-4 w-4 mr-1 text-emerald-600" />
              Treatments & Procedures
            </h3>
            
            {isLoadingTreatments ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}
              </div>
            ) : treatments && treatments.length > 0 ? (
              <div className="space-y-2">
                {treatments.map((treatment) => (
                  <TreatmentItem key={treatment.id} treatment={treatment} />
                ))}
              </div>
            ) : (
              <div className="text-sm text-center p-4 text-muted-foreground">
                No treatments found
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function DocumentItem({ document }: { document: any }) {
  // Get file icon based on document type
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'image':
        return <File className="h-4 w-4 text-blue-500" />;
      case 'pdf':
        return <File className="h-4 w-4 text-red-500" />;
      case 'report':
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Format upload date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="border rounded-md p-2.5 hover:bg-gray-50 flex justify-between items-center transition-colors">
      <div className="flex items-center">
        <div className="bg-gray-100 p-1.5 rounded mr-2">
          {getFileIcon(document.documentType)}
        </div>
        <div>
          <p className="text-sm font-medium">{document.title}</p>
          <p className="text-xs text-muted-foreground">Uploaded {formatDate(document.uploadedAt || document.createdAt)}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function TreatmentItem({ treatment }: { treatment: any }) {
  // Format treatment date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
      case 'pending':
        return <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="ml-2">{status}</Badge>;
    }
  };
  
  return (
    <div className="border rounded-md p-2.5 hover:bg-gray-50 flex justify-between items-center transition-colors">
      <div className="flex items-center">
        <div className="bg-gray-100 p-1.5 rounded mr-2">
          <Stethoscope className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <div className="flex items-center">
            <p className="text-sm font-medium">{treatment.procedure}</p>
            {getBadgeVariant(treatment.status)}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(treatment.treatmentDate)}
            {treatment.toothNumber && (
              <span className="ml-2">Tooth #{treatment.toothNumber}</span>
            )}
          </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}