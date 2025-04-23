import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/scheduling/AppHeader";
import CalendarView from "@/components/scheduling/CalendarView";
import LeftRail from "@/components/scheduling/LeftRail";
import RightRail from "@/components/scheduling/RightRail";
import { ViewModeType, ViewMode } from "@shared/schema";
import { format } from "date-fns";
import BookAppointmentDialog from "@/components/scheduling/BookAppointmentDialog";
import { useToast } from "@/hooks/use-toast";

export default function SchedulingPage() {
  // Initialize with April 23, 2025 to match our sample data
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 3, 23));
  const [viewMode, setViewMode] = useState<ViewModeType>("OPERATORY");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { toast } = useToast();

  // Fetch utilization for the day
  const { data: utilizationData } = useQuery({
    queryKey: ['/api/scheduling/utilization', format(selectedDate, 'yyyy-MM-dd')],
    enabled: true,
  });

  // Handle navigation
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    // Set to our "today" in the sample data (April 23, 2025)
    setSelectedDate(new Date(2025, 3, 23));
  };

  const handleOpenBooking = () => {
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  const handleBookAppointment = () => {
    toast({
      title: "Appointment Scheduled",
      description: "The appointment has been successfully scheduled.",
    });
    setIsBookingOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <AppHeader
        selectedDate={selectedDate}
        onPrevious={goToPreviousDay}
        onNext={goToNextDay}
        onToday={goToToday}
        onViewChange={setViewMode}
        currentView={viewMode}
        utilizationPercentage={utilizationData?.percentage || 78}
        onBookAppointment={handleOpenBooking}
      />

      <div className="flex-1 grid grid-cols-[2fr_8fr_2fr] gap-4 p-4 overflow-hidden">
        <LeftRail selectedDate={selectedDate} />
        <CalendarView 
          selectedDate={selectedDate} 
          viewMode={viewMode} 
        />
        <RightRail selectedDate={selectedDate} />
      </div>

      <BookAppointmentDialog
        open={isBookingOpen}
        onClose={handleCloseBooking}
        onBook={handleBookAppointment}
        selectedDate={selectedDate}
      />
    </div>
  );
}
