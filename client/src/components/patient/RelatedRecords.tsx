import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ToothDiagram from "./ToothDiagram";
import AccordionSection from "@/components/shared/ui/AccordionSection";
import RecordItem from "@/components/shared/ui/RecordItem";
import {
  FileClock, FileText, CalendarDays, Stethoscope, 
  Folder, Users, ImagePlus, FlaskRound, CreditCard, File,
  Plus, Upload, UserPlus, Eye, DownloadCloud, Calendar,
  ChevronDown, Map, DollarSign, Landmark
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
            icon={<FileClock className="h-4 w-4" />} 
            title="Claims" 
            count={3}
          >
            <div className="border rounded divide-y">
              <RecordItem
                title="Claim #A927"
                subtitle="D2740 Crown #30"
                value="$1,180.00"
                status={<Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>}
              />
              <RecordItem
                title="Claim #A842"
                subtitle="D2950 Core buildup"
                value="$240.00"
                status={<Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>}
              />
              <RecordItem
                title="Claim #A718"
                subtitle="D0274 Bitewings"
                value="$65.00"
                status={<Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>}
              />
            </div>
            <div className="flex justify-between mt-2">
              <Button variant="default" size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                New Claim
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                View All
              </Button>
            </div>
          </AccordionSection>
          
          <AccordionSection 
            id="statements" 
            icon={<FileText className="h-4 w-4" />} 
            title="Statements" 
            count={2}
          >
            <div className="border rounded divide-y">
              <RecordItem
                title="Statement #S103"
                subtitle="Apr 15, 2025"
                value="$220.00"
                status={<Badge variant="destructive">Unpaid</Badge>}
              />
              <RecordItem
                title="Statement #S097"
                subtitle="Mar 10, 2025"
                value="$614.00"
                status={<Badge variant="destructive">Unpaid</Badge>}
              />
            </div>
            <div className="flex justify-between mt-2">
              <Button variant="default" size="sm" className="h-8">
                <CreditCard className="h-4 w-4 mr-1" />
                Pay Balance
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                View All
              </Button>
            </div>
          </AccordionSection>
          
          <AccordionSection 
            id="visits" 
            icon={<CalendarDays className="h-4 w-4" />} 
            title="Visits" 
            count={4}
          >
            <div className="border rounded divide-y">
              <RecordItem
                title="Apr 13, 2025"
                subtitle="Crown Placement"
                meta="Dr. Nguyen"
                action={<Button variant="ghost" size="icon" className="h-7 w-7">
                  <Eye className="h-3.5 w-3.5" />
                </Button>}
              />
              <RecordItem
                title="Mar 30, 2025"
                subtitle="Crown Prep"
                meta="Dr. Nguyen"
                action={<Button variant="ghost" size="icon" className="h-7 w-7">
                  <Eye className="h-3.5 w-3.5" />
                </Button>}
              />
              <RecordItem
                title="Jan 15, 2025"
                subtitle="Hygiene"
                meta="Amy Chen, RDH"
                action={<Button variant="ghost" size="icon" className="h-7 w-7">
                  <Eye className="h-3.5 w-3.5" />
                </Button>}
              />
              <RecordItem
                title="Jul 12, 2024"
                subtitle="Hygiene"
                meta="Amy Chen, RDH"
                action={<Button variant="ghost" size="icon" className="h-7 w-7">
                  <Eye className="h-3.5 w-3.5" />
                </Button>}
              />
            </div>
            <div className="flex justify-between mt-2">
              <Button variant="default" size="sm" className="h-8">
                <Calendar className="h-4 w-4 mr-1" />
                Schedule
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                View All
              </Button>
            </div>
          </AccordionSection>
          
          <AccordionSection 
            id="procedures" 
            icon={<Stethoscope className="h-4 w-4" />} 
            title="Procedures" 
            count={5}
          >
            <div className="border rounded divide-y">
              <div>
                <Collapsible>
                  <div className="p-2 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">D2740 Crown #30</div>
                        <div className="text-xs text-muted-foreground">Apr 13, 2025 · Dr. Nguyen</div>
                      </div>
                      <div className="flex items-center">
                        <div className="font-medium mr-2">$1,180.00</div>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="View Tooth Location">
                            <Map className="h-3.5 w-3.5" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    <CollapsibleContent>
                      <div className="mt-2 border-t pt-2 bg-gray-50 p-2">
                        <div className="text-xs font-medium mb-1 text-center">Tooth #30 Location</div>
                        <ToothDiagram highlightedTooth={30} />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </div>
              <div>
                <Collapsible>
                  <div className="p-2 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">D2950 Core buildup #30</div>
                        <div className="text-xs text-muted-foreground">Mar 30, 2025 · Dr. Nguyen</div>
                      </div>
                      <div className="flex items-center">
                        <div className="font-medium mr-2">$240.00</div>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="View Tooth Location">
                            <Map className="h-3.5 w-3.5" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    <CollapsibleContent>
                      <div className="mt-2 border-t pt-2 bg-gray-50 p-2">
                        <div className="text-xs font-medium mb-1 text-center">Tooth #30 Location</div>
                        <ToothDiagram highlightedTooth={30} />
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </div>
              <div>
                <div className="p-2 hover:bg-gray-50 flex justify-between items-center">
                  <div>
                    <div className="font-medium">D0274 Bitewings - four films</div>
                    <div className="text-xs text-muted-foreground">Jan 15, 2025 · Amy Chen, RDH</div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-medium mr-2">$65.00</div>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-2">
              <Button variant="default" size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                Add Procedure
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                View All
              </Button>
            </div>
          </AccordionSection>
          
          <AccordionSection 
            id="documents" 
            icon={<Folder className="h-4 w-4" />} 
            title="Documents" 
            count={8}
          >
            <div className="border rounded divide-y">
              <div className="p-2 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <div className="font-medium">HIPAA Consent.pdf</div>
                  <div className="text-xs text-muted-foreground">Uploaded: Apr 18, 2025</div>
                </div>
                <div className="flex">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <DownloadCloud className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="p-2 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <div className="font-medium">Insurance Card.jpg</div>
                  <div className="text-xs text-muted-foreground">Uploaded: Jan 02, 2025</div>
                </div>
                <div className="flex">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <DownloadCloud className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="p-2 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <div className="font-medium">Treatment Consent</div>
                  <div className="text-xs text-muted-foreground">Signed: Mar 30, 2025</div>
                </div>
                <div className="flex">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <DownloadCloud className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <Button variant="default" size="sm" className="h-8">
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                View All
              </Button>
            </div>
          </AccordionSection>
          
          <AccordionSection 
            id="contacts" 
            icon={<Users className="h-4 w-4" />} 
            title="Related Contacts" 
            count={2}
          >
            <div className="border rounded divide-y">
              <div className="p-2 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div className="font-medium">John Johnson</div>
                  <Badge variant="outline" className="text-xs">Guarantor</Badge>
                </div>
                <div className="text-xs text-muted-foreground">Spouse</div>
                <div className="text-xs text-muted-foreground">(555) 123-4567</div>
              </div>
              <div className="p-2 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div className="font-medium">Emily Watson</div>
                  <Badge variant="outline" className="text-xs">Emergency</Badge>
                </div>
                <div className="text-xs text-muted-foreground">Sister</div>
                <div className="text-xs text-muted-foreground">(555) 987-6543</div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <Button variant="default" size="sm" className="h-8">
                <UserPlus className="h-4 w-4 mr-1" />
                Add Contact
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                View All
              </Button>
            </div>
          </AccordionSection>
          
          <AccordionSection 
            id="imaging" 
            icon={<ImagePlus className="h-4 w-4" />} 
            title="Imaging" 
            count={3}
          >
            <div className="border rounded divide-y">
              <RecordItem
                title="Panoramic X-ray"
                subtitle="Apr 13, 2025"
                meta="Dr. Nguyen"
                action={<Button variant="ghost" size="icon" className="h-7 w-7">
                  <Eye className="h-3.5 w-3.5" />
                </Button>}
              />
              <RecordItem
                title="Bitewing X-rays (4)"
                subtitle="Jan 15, 2025"
                meta="Amy Chen, RDH"
                action={<Button variant="ghost" size="icon" className="h-7 w-7">
                  <Eye className="h-3.5 w-3.5" />
                </Button>}
              />
              <RecordItem
                title="Periapical X-ray #30"
                subtitle="Mar 30, 2025"
                meta="Dr. Nguyen"
                action={<Button variant="ghost" size="icon" className="h-7 w-7">
                  <Eye className="h-3.5 w-3.5" />
                </Button>}
              />
            </div>
            <div className="flex justify-between mt-2">
              <Button variant="default" size="sm" className="h-8">
                <ImagePlus className="h-4 w-4 mr-1" />
                New Image
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                View All
              </Button>
            </div>
          </AccordionSection>
          
          <AccordionSection 
            id="lab" 
            icon={<FlaskRound className="h-4 w-4" />} 
            title="Lab Cases" 
            count={1}
          >
            <div className="border rounded divide-y">
              <RecordItem
                title="Lab Case #L453"
                subtitle="Crown #30"
                meta="Apex Dental Lab"
                value="$420.00"
              />
            </div>
            <div className="flex justify-between mt-2">
              <Button variant="default" size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                New Lab Case
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                View All
              </Button>
            </div>
          </AccordionSection>
          
          <AccordionSection 
            id="financing" 
            icon={<Landmark className="h-4 w-4" />} 
            title="Patient Financing" 
            count={2}
          >
            <div className="border rounded divide-y">
              <RecordItem
                title="CareCredit Loan #CC21587"
                subtitle="Crown treatment plan"
                value="$1,420.00"
                status={<Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Active</Badge>}
              />
              <RecordItem
                title="In-House Payment Plan #PP103"
                subtitle="3 monthly payments"
                value="$614.00"
                status={<Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Active</Badge>}
              />
            </div>
            <div className="flex justify-between mt-2">
              <Button variant="default" size="sm" className="h-8">
                <DollarSign className="h-4 w-4 mr-1" />
                New Financing
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                View All
              </Button>
            </div>
          </AccordionSection>
        </Accordion>
      </CardContent>
    </Card>
  );
}

