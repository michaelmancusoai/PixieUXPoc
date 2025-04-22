import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Function to generate days for a demo calendar
const generateCalendarDays = () => {
  const days = [];
  const totalDays = 35; // 5 weeks x 7 days
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  const startingDay = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

  // Add days from previous month
  for (let i = startingDay - 1; i >= 0; i--) {
    days.push({
      date: lastDayOfPrevMonth.getDate() - i,
      isCurrentMonth: false,
      events: [],
    });
  }

  // Add days from current month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: i,
      isCurrentMonth: true,
      events: i === 5 ? [{ time: "9:00 AM", title: "Root Canal", type: "procedure" }] 
        : i === 7 ? [{ time: "2:30 PM", title: "Cleaning", type: "cleaning" }]
        : i === 10 ? [{ time: "10:00 AM", title: "Consultation", type: "consultation" }]
        : [],
    });
  }

  // Add days from next month to complete the grid
  const remainingDays = totalDays - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      events: [],
    });
  }

  return days;
};

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const days = generateCalendarDays();

  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const getEventClassName = (type: string) => {
    switch (type) {
      case 'procedure':
        return 'bg-blue-100 text-blue-800';
      case 'cleaning':
        return 'bg-green-100 text-green-800';
      case 'consultation':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-neutral-border">
        <h2 className="text-xl font-semibold">Calendar</h2>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={goToToday}
            variant="outline" 
            size="sm"
            className="text-sm"
          >
            Today
          </Button>
          <div className="flex">
            <Button 
              onClick={previousMonth}
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-r-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              onClick={nextMonth}
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-l-none border-l-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="ml-2 font-medium text-gray-700">
            {monthName} {year}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-7 border-b border-neutral-border">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div 
              key={day} 
              className="text-center py-2 text-gray-500 text-sm font-medium"
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, index) => (
            <div 
              key={index} 
              className="bg-white min-h-[100px] p-1"
            >
              <div 
                className={cn(
                  "text-right text-xs p-1",
                  day.isCurrentMonth ? "" : "text-gray-400"
                )}
              >
                {day.date}
              </div>
              {day.events.map((event, eventIndex) => (
                <div 
                  key={eventIndex}
                  className={cn(
                    "rounded px-2 py-1 text-xs mb-1",
                    getEventClassName(event.type)
                  )}
                >
                  {event.time} - {event.title}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Import for cn helper
import { cn } from "@/lib/utils";
