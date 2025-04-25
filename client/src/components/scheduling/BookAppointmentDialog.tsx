import { useState } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Define form schema with Zod
const formSchema = z.object({
  patient: z.string().min(1, "Patient is required"),
  sendReminders: z.boolean().default(true),
  category: z.string().min(1, "Category is required"),
  procedures: z.array(z.string()).min(1, "At least one procedure is required"),
  comments: z.string().optional(),
  addToAsapList: z.boolean().default(false),
  date: z.date({
    required_error: "Date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  provider: z.string().min(1, "Provider is required"),
  hygienist: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BookAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName?: string;
}

export default function BookAppointmentDialog({
  open,
  onOpenChange,
  patientName = "",
}: BookAppointmentDialogProps) {
  const [activeTab, setActiveTab] = useState<"set" | "find">("set");
  
  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient: patientName,
      sendReminders: true,
      category: "",
      procedures: [],
      comments: "",
      addToAsapList: false,
      startTime: "",
      provider: "",
      hygienist: "",
    },
  });
  
  // Generate sample time slots for the demo
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour > 12 ? hour - 12 : hour;
        const displayMinute = minute === 0 ? "00" : minute;
        const label = `${displayHour}:${displayMinute} ${period}`;
        const value = `${hour.toString().padStart(2, "0")}:${displayMinute}`;
        slots.push({ label, value });
      }
    }
    return slots;
  };
  
  const timeSlots = generateTimeSlots();
  
  // Sample procedure categories
  const procedureCategories = [
    { name: "Surgery", id: "surgery" },
    { name: "New Patient Exam", id: "new-patient-exam" },
    { name: "Adult Prophy & Exam", id: "adult-prophy-exam" },
    { name: "Emergency Exam", id: "emergency-exam" },
    { name: "New Pediatric Patient Exam", id: "new-pediatric-patient-exam" },
    { name: "Consultation", id: "consultation" },
    { name: "Child Prophy & Exam", id: "child-prophy-exam" },
    { name: "Botox", id: "botox" },
    { name: "Treatment Plan", id: "treatment-plan" },
  ];
  
  // Sample procedure list
  const procedureList = [
    { id: "perex", name: "PerEx", category: "adult-prophy-exam" },
    { id: "4bw", name: "4BW", category: "adult-prophy-exam" },
    { id: "pro", name: "Pro", category: "adult-prophy-exam" },
    { id: "flovarn", name: "FloVarn", category: "adult-prophy-exam" },
  ];
  
  // Sample providers
  const providers = [
    { id: "dr-winderfield", name: "Dr. Winderfield" },
    { id: "dr-sak", name: "Dr. Sak" },
    { id: "dr-capps", name: "Dr. Capps" },
    { id: "dr-rowley", name: "Dr. Rowley" },
  ];
  
  // Sample hygienists
  const hygienists = [
    { id: "n-sheth", name: "N. Sheth" },
    { id: "e-shenton", name: "E. Shenton" },
  ];
  
  // Form submission handler
  const onSubmit = (values: FormValues) => {
    console.log("Form values:", values);
    // In a real app, you would send this to your API
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Appointment</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Info Section */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="patient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium">{field.value || "Select Patient"}</FormLabel>
                        <FormDescription>
                          {field.value ? "" : "Please select a patient for this appointment"}
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="sendReminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Send auto-reminders
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Procedures Section */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">Procedures</h3>
              
              {/* Categories */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                    <div className="flex flex-wrap gap-1">
                      {procedureCategories.map((category) => (
                        <Button
                          key={category.id}
                          type="button"
                          variant={field.value === category.id ? "default" : "outline"}
                          onClick={() => field.onChange(category.id)}
                          className="rounded-full h-7 text-xs px-3"
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Procedure Selection */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="procedures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Category Procedures <span className="text-red-500">*</span></FormLabel>
                      <div className="flex flex-wrap gap-1">
                        {procedureList
                          .filter(proc => !form.getValues("category") || proc.category === form.getValues("category"))
                          .map((procedure) => {
                            const isSelected = field.value.includes(procedure.id);
                            return (
                              <Badge
                                key={procedure.id}
                                variant={isSelected ? "default" : "outline"}
                                className="cursor-pointer text-xs h-6"
                                onClick={() => {
                                  const currentValues = [...field.value];
                                  if (isSelected) {
                                    field.onChange(currentValues.filter(id => id !== procedure.id));
                                  } else {
                                    field.onChange([...currentValues, procedure.id]);
                                  }
                                }}
                              >
                                {procedure.name}
                                {isSelected && <span className="ml-1">✕</span>}
                              </Badge>
                            );
                          })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel className="text-sm">Addtl Procedures <span className="text-red-500">*</span></FormLabel>
                  <div className="flex items-center space-x-2">
                    <Button type="button" variant="outline" size="icon" className="h-7 w-7 rounded-full">+</Button>
                    <span className="text-xs text-muted-foreground">Add more procedures</span>
                  </div>
                </div>
              </div>
              
              {/* Comments */}
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Comments</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please give brief overview of patient's condition e.g. Broken tooth/severe tooth pain/ etc."
                        {...field}
                        className="min-h-[60px] text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* ASAP List */}
            <div className="border-t pt-3">
              <h3 className="text-sm font-medium">ASAP List</h3>
              <FormField
                control={form.control}
                name="addToAsapList"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-normal">
                      Add Patient to ASAP List
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Tabs for Set/Find Appointment */}
            <div className="border-t pt-4">
              <div className="flex border-b">
                <Button
                  type="button"
                  variant="ghost"
                  className={`px-4 py-2 -mb-px border-b-2 ${
                    activeTab === "set"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveTab("set")}
                >
                  Set Appointment
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`px-4 py-2 -mb-px border-b-2 ${
                    activeTab === "find"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveTab("find")}
                >
                  Find Appointment
                </Button>
              </div>
              
              {/* Set Appointment View */}
              {activeTab === "set" && (
                <div className="pt-4 space-y-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="w-20">
                      <FormLabel>Show from</FormLabel>
                    </div>
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[180px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "MM/dd/yyyy")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex space-x-1">
                      <Button type="button" variant="outline" size="sm">Today</Button>
                      <Button type="button" variant="outline" size="sm">+3m</Button>
                      <Button type="button" variant="outline" size="sm">+6m</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3 bg-gray-50">
                    {/* Day Selection */}
                    <div className="mb-3">
                      <label className="block text-sm mb-1">Days</label>
                      <div className="flex space-x-1">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                          <div
                            key={i}
                            className={`flex items-center justify-center w-8 h-8 rounded-md ${
                              i === 3 ? "bg-blue-500 text-white" : "bg-white"
                            }`}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* AM/PM Selection */}
                    <div className="mb-3">
                      <label className="block text-sm mb-1">Time Slot</label>
                      <div className="flex space-x-1">
                        <div className="flex items-center justify-center w-12 h-8 rounded-md bg-blue-500 text-white">
                          AM
                        </div>
                        <div className="flex items-center justify-center w-12 h-8 rounded-md bg-white">
                          PM
                        </div>
                      </div>
                    </div>
                    
                    {/* Time Range Selection */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-sm mb-1">From</label>
                        <Select defaultValue="08:00">
                          <SelectTrigger className="bg-white h-8 text-sm">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="08:00">8:00 AM</SelectItem>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">To</label>
                        <Select defaultValue="13:00">
                          <SelectTrigger className="bg-white h-8 text-sm">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12:00">12:00 PM</SelectItem>
                            <SelectItem value="13:00">1:00 PM</SelectItem>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="15:00">3:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Provider Selection */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <FormField
                          control={form.control}
                          name="provider"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Provider</FormLabel>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {providers.map(provider => (
                                  <Button
                                    key={provider.id}
                                    type="button"
                                    onClick={() => field.onChange(provider.id)}
                                    variant={field.value === provider.id ? "default" : "outline"}
                                    size="sm"
                                    className={`text-xs px-2 py-1 h-7 ${
                                      provider.id === "dr-sak" ? "bg-blue-100 border-blue-300" : ""
                                    }`}
                                  >
                                    {provider.name}
                                  </Button>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="hygienist"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Hygienist</FormLabel>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {hygienists.map(hygienist => (
                                  <Button
                                    key={hygienist.id}
                                    type="button"
                                    onClick={() => field.onChange(hygienist.id)}
                                    variant={field.value === hygienist.id ? "default" : "outline"}
                                    size="sm"
                                    className="text-xs px-2 py-1 h-7"
                                  >
                                    {hygienist.name}
                                  </Button>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Time Slots */}
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Time Slots</h4>
                    <div className="border rounded-md max-h-[180px] overflow-y-auto">
                      <div className="flex justify-between items-center p-2 border-b bg-gray-50">
                        <div className="font-medium text-sm">Available Providers & Hygienists</div>
                      </div>
                      
                      <div className="divide-y">
                        <div className="p-2">
                          <div className="font-medium mb-1 text-sm">Wednesday, August 16th</div>
                          <div className="flex items-center">
                            <div className="w-32 text-sm">09:00 - 10:00 AM</div>
                            <Badge variant="outline" className="ml-2 text-xs">Dr. Sak</Badge>
                          </div>
                        </div>
                        
                        <div className="p-2">
                          <div className="font-medium mb-1 text-sm">Thursday, August 17th</div>
                          <div className="flex items-center">
                            <div className="w-32 text-sm">09:00 - 10:00 AM</div>
                            <Badge variant="outline" className="ml-2 text-xs">Dr. Sak</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Find Appointment View (simplified for now) */}
              {activeTab === "find" && (
                <div className="py-4">
                  <p className="text-center text-muted-foreground">
                    Find appointment feature allows you to search for available slots.
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}