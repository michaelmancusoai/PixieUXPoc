import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DatePicker } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import { PixieTheme, getButtonStyle } from "../../lib/theme";
// Custom types for the component
interface Patient {
  id: number;
  firstName: string;
  lastName: string;
}

interface Provider {
  id: number;
  name: string;
  role: string;
}

interface Operatory {
  id: number;
  name: string;
}

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
  selectedDate
}: BookAppointmentDialogProps) {
  const [appointmentDate, setAppointmentDate] = useState<Date>(selectedDate);
  const [startTime, setStartTime] = useState<Date | null>(
    new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate(), 9, 0)
  );
  const [duration, setDuration] = useState<number>(30);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedOperatory, setSelectedOperatory] = useState<string>("");
  const [selectedProcedure, setSelectedProcedure] = useState<string>("");

  // Fetch patients for dropdown
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ['/api/patients'],
    enabled: open,
  });

  // Fetch providers for dropdown
  const { data: providers = [] } = useQuery<Provider[]>({
    queryKey: ['/api/providers'],
    enabled: open,
  });

  // Fetch operatories for dropdown
  const { data: operatories = [] } = useQuery<Operatory[]>({
    queryKey: ['/api/operatories'],
    enabled: open,
  });

  // Define a type for procedures
  interface Procedure {
    code: string;
    description: string;
  }

  // Fetch procedures for dropdown (CDT codes)
  const { data: procedures = [] } = useQuery<Procedure[]>({
    queryKey: ['/api/procedures'],
    enabled: open,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBook();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Enter the appointment details below to schedule a new visit.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Patient Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient" className="text-right">
                Patient
              </Label>
              <div className="col-span-3">
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.length > 0 ? (
                      patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          {patient.firstName} {patient.lastName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>Loading patients...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Provider Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="provider" className="text-right">
                Provider
              </Label>
              <div className="col-span-3">
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.length > 0 ? (
                      providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id.toString()}>
                          {provider.name} ({provider.role})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>Loading providers...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Operatory Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="operatory" className="text-right">
                Operatory
              </Label>
              <div className="col-span-3">
                <Select value={selectedOperatory} onValueChange={setSelectedOperatory}>
                  <SelectTrigger id="operatory">
                    <SelectValue placeholder="Select operatory" />
                  </SelectTrigger>
                  <SelectContent>
                    {operatories.length > 0 ? (
                      operatories.map((op) => (
                        <SelectItem key={op.id} value={op.id.toString()}>
                          {op.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>Loading operatories...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Procedure Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="procedure" className="text-right">
                Procedure
              </Label>
              <div className="col-span-3">
                <Select value={selectedProcedure} onValueChange={setSelectedProcedure}>
                  <SelectTrigger id="procedure">
                    <SelectValue placeholder="Select procedure" />
                  </SelectTrigger>
                  <SelectContent>
                    {procedures.length > 0 ? (
                      procedures.map((proc) => (
                        <SelectItem key={proc.code} value={proc.code}>
                          {proc.code} - {proc.description}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>Loading procedures...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Date Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={appointmentDate}
                  onChange={(newDate) => newDate && setAppointmentDate(newDate)}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Time Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Start Time
              </Label>
              <div className="col-span-3">
                <TimePicker
                  value={startTime}
                  onChange={(newTime) => setStartTime(newTime)}
                  className="w-full"
                  views={['hours', 'minutes']}
                />
              </div>
            </div>
            
            {/* Duration Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <div className="col-span-3">
                <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value, 10))}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              type="submit" 
              style={PixieTheme.buttons.primary}
              className="hover:opacity-90 transition-all"
              disabled={!selectedPatient || !selectedProvider || !selectedOperatory || !startTime}
            >
              Schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
