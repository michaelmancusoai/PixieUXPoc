import { useState } from "react";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import AppHeader from "@/components/scheduling/AppHeader";
import CalendarView from "@/components/scheduling/CalendarView";
import LeftRail from "@/components/scheduling/LeftRail";
import RightRail from "@/components/scheduling/RightRail";
import { ViewModeType } from "@/lib/scheduling-constants";
import BookAppointmentDialog from "@/components/scheduling/BookAppointmentDialog";
import { useToast } from "@/hooks/use-toast";
import { DndContext } from "@dnd-kit/core";

export default function SchedulingPage() {
  // Initialize with April 23, 2025 to match our sample data in the demo
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 3, 23));
  const [viewMode, setViewMode] = useState<ViewModeType>("OPERATORY");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  // Add state for layout mode: true for expanded calendar (middle only), false for three columns
  const [expandedView, setExpandedView] = useState(false);
  const { toast } = useToast();

  // We no longer need utilization percentage since it's been removed from the UI
  // const utilizationPercentage = 78;

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
  
  // Toggle layout view between 3-column and expanded calendar
  const toggleExpandedView = () => {
    setExpandedView(prev => !prev);
  };

  return (
    <NavigationWrapper>
      <DndContext>
        <div className="h-[calc(100vh-64px)] flex flex-col">
          <div className="relative">
            <AppHeader
              selectedDate={selectedDate}
              onPrevious={goToPreviousDay}
              onNext={goToNextDay}
              onToday={goToToday}
              onViewChange={setViewMode}
              currentView={viewMode}
              onBookAppointment={handleOpenBooking}
              expandedView={expandedView}
              onToggleExpandView={toggleExpandedView}
            />
          </div>

          <div className={`flex-1 grid ${expandedView ? 'grid-cols-1' : 'grid-cols-[250px_minmax(0,1fr)_250px]'} gap-4 p-4 h-full overflow-hidden`}>
            {!expandedView && <div className="h-full"><LeftRail selectedDate={selectedDate} /></div>}
            <div className="h-full">
              <CalendarView 
                selectedDate={selectedDate} 
                viewMode={viewMode} 
              />
            </div>
            {!expandedView && <div className="h-full"><RightRail selectedDate={selectedDate} /></div>}
          </div>

          <BookAppointmentDialog
            open={isBookingOpen}
            onClose={handleCloseBooking}
            onBook={handleBookAppointment}
            selectedDate={selectedDate}
          />
        </div>
      </DndContext>
    </NavigationWrapper>
  );
}