import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CDT_CATEGORIES } from "@/lib/scheduling-constants";

// Define the form schema
const formSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required" }),
  providerId: z.string().min(1, { message: "Provider is required" }),
  operatoryId: z.string().min(1, { message: "Operatory is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  procedure: z.string().optional(),
  cdtCode: z.string().optional(),
  notes: z.string().optional(),
});

interface BookAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onBook: () => void;
  selectedDate: Date;
}

export default function BookAppointmentDialog({
  open,
  onClose,
  onBook,
  selectedDate,
}: BookAppointmentDialogProps) {
  const [selectedCdtCategory, setSelectedCdtCategory] = useState("");

  // Sample data for the dropdowns
  const patients = [
    { id: 1, name: "John Johnson" },
    { id: 2, name: "Maria Garcia" },
    { id: 3, name: "David Lee" },
    { id: 4, name: "Sarah Martinez" },
    { id: 5, name: "Robert Wilson" },
  ];

  const providers = [
    { id: 1, name: "Dr. Nguyen" },
    { id: 2, name: "Dr. Robert" },
    { id: 3, name: "Dr. Johnson" },
    { id: 4, name: "Dr. Maria" },
  ];

  const operatories = [
    { id: 1, name: "Op 1" },
    { id: 2, name: "Op 2" },
    { id: 3, name: "Op 3" },
    { id: 4, name: "Op 4" },
  ];

  const durations = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1 hour 30 minutes" },
    { value: "120", label: "2 hours" },
  ];

  const timeSlots: { value: string; label: string }[] = [];
  // Generate time slots from 8:00 AM to 5:00 PM
  for (let hour = 8; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h = hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? "PM" : "AM";
      const formattedMinute = minute === 0 ? "00" : minute;
      const formattedHour = hour === 0 ? 12 : h;
      const timeLabel = `${formattedHour}:${formattedMinute} ${period}`;
      const timeValue = `${hour.toString().padStart(2, "0")}:${formattedMinute.toString().padStart(2, "0")}`;
      timeSlots.push({ value: timeValue, label: timeLabel });
    }
  }

  // CDT codes (dental procedure codes)
  const cdtCodes = [
    // Diagnostic
    { code: "D0120", name: "Periodic Oral Evaluation" },
    { code: "D0150", name: "Comprehensive Oral Evaluation" },
    { code: "D0210", name: "Complete Series of Radiographs" },
    { code: "D0220", name: "Intraoral - Periapical First Film" },
    { code: "D0274", name: "Bitewings - Four Films" },
    // Preventive
    { code: "D1110", name: "Prophylaxis - Adult" },
    { code: "D1120", name: "Prophylaxis - Child" },
    { code: "D1206", name: "Fluoride Varnish" },
    { code: "D1351", name: "Sealant - Per Tooth" },
    // Restorative
    { code: "D2140", name: "Amalgam - One Surface" },
    { code: "D2330", name: "Resin-Based Composite - One Surface" },
    { code: "D2332", name: "Resin-Based Composite - Three Surfaces" },
    { code: "D2335", name: "Resin-Based Composite - Four Surfaces" },
    { code: "D2391", name: "Resin-Based Composite - One Surface" },
    { code: "D2750", name: "Crown - Porcelain Fused to High Noble Metal" },
    { code: "D2790", name: "Crown - Full Cast High Noble Metal" },
    { code: "D2950", name: "Core Buildup, Including any Pins" },
    // Endodontics
    { code: "D3310", name: "Anterior Root Canal" },
    { code: "D3320", name: "Bicuspid Root Canal" },
    { code: "D3330", name: "Molar Root Canal" },
  ];

  // Filter CDT codes by category
  const filteredCdtCodes = selectedCdtCategory
    ? cdtCodes.filter((code) => code.code.startsWith(selectedCdtCategory))
    : cdtCodes;

  // Set up the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      providerId: "",
      operatoryId: "",
      duration: "30",
      startTime: "09:00",
      procedure: "",
      cdtCode: "",
      notes: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Booking appointment with values:", values);
    onBook();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Schedule a new appointment for{" "}
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Patient Selection */}
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem
                            key={patient.id}
                            value={patient.id.toString()}
                          >
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Provider Selection */}
              <FormField
                control={form.control}
                name="providerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem
                            key={provider.id}
                            value={provider.id.toString()}
                          >
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Operatory Selection */}
              <FormField
                control={form.control}
                name="operatoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operatory</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operatory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {operatories.map((operatory) => (
                          <SelectItem
                            key={operatory.id}
                            value={operatory.id.toString()}
                          >
                            {operatory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration Selection */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {durations.map((duration) => (
                          <SelectItem key={duration.value} value={duration.value}>
                            {duration.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Time Selection */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select start time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((timeSlot, index) => (
                          <SelectItem key={index} value={timeSlot.value}>
                            {timeSlot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CDT Category Selection */}
              <FormItem>
                <FormLabel>CDT Category</FormLabel>
                <Select
                  onValueChange={setSelectedCdtCategory}
                  value={selectedCdtCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value={CDT_CATEGORIES.DIAGNOSTIC}>
                      Diagnostic (D0)
                    </SelectItem>
                    <SelectItem value={CDT_CATEGORIES.PREVENTIVE}>
                      Preventive (D1)
                    </SelectItem>
                    <SelectItem value={CDT_CATEGORIES.RESTORATIVE}>
                      Restorative (D2)
                    </SelectItem>
                    <SelectItem value={CDT_CATEGORIES.ENDODONTICS}>
                      Endodontics (D3)
                    </SelectItem>
                    <SelectItem value={CDT_CATEGORIES.PERIODONTICS}>
                      Periodontics (D4)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            {/* CDT Code Selection */}
            <FormField
              control={form.control}
              name="cdtCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CDT Code</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Find the selected code
                      const selectedCode = cdtCodes.find((code) => code.code === value);
                      if (selectedCode) {
                        // Update the procedure field with the name of the CDT code
                        form.setValue("procedure", selectedCode.name);
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select CDT code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredCdtCodes.map((cdt) => (
                        <SelectItem key={cdt.code} value={cdt.code}>
                          {cdt.code} - {cdt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Procedure Description */}
            <FormField
              control={form.control}
              name="procedure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Procedure</FormLabel>
                  <FormControl>
                    <Input placeholder="Procedure description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Additional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Book Appointment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}