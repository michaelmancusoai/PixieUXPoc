import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addDays, isBefore } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CountdownTimer } from "@/lib/scheduling-utils";

interface LeftRailProps {
  selectedDate: Date;
}

export default function LeftRail({ selectedDate }: LeftRailProps) {
  // Fetch gap data for the next 3 days
  const { data: gapData = [] } = useQuery<any[]>({
    queryKey: ['/api/scheduling/gaps', format(selectedDate, 'yyyy-MM-dd')],
    enabled: true,
  });

  // Fetch waitlist data
  const { data: waitlistData = [] } = useQuery<any[]>({
    queryKey: ['/api/scheduling/waitlist'],
    enabled: true,
  });

  // Fetch inventory alerts
  const { data: inventoryAlerts = [] } = useQuery<any[]>({
    queryKey: ['/api/scheduling/inventory-alerts'],
    enabled: true,
  });

  // Format today's date for display
  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  
  const getRelativeDateText = (dateString: string) => {
    if (dateString === today) return "Today";
    if (dateString === tomorrow) return "Tomorrow";
    return format(new Date(dateString), "MMM d");
  };
  
  return (
    <div className="flex flex-col space-y-4 overflow-y-auto pb-4">
      {/* Gap Filler Card */}
      <Card className="shadow-sm">
        <CardHeader className="bg-blue-100 py-2 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium">
              {gapData?.length || 0}
            </div>
            <CardTitle className="text-sm font-medium">Available Gaps (Next 3 Days)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <p className="text-xs text-gray-600 mb-2 px-2">
            Open time slots that can be filled with appointments from the standby list.
          </p>
          {gapData.length > 0 ? (
            <div className="space-y-0.5">
              {gapData.map((gap: any) => (
                <div key={`${gap.date}-${gap.startTime}-${gap.operatoryId}`} 
                  className="px-2 py-1.5 hover:bg-gray-50 rounded border-b last:border-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">
                        {getRelativeDateText(gap.date)}, {format(new Date(`2000-01-01T${gap.startTime}`), 'h:mm a')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {gap.duration} min · Op {gap.operatoryId}
                      </p>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-7 px-3">
                      Fill Gap
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No gaps found in the next 3 days</p>
          )}
        </CardContent>
      </Card>

      {/* Standby List */}
      <Card className="shadow-sm">
        <CardHeader className="bg-blue-100 py-2 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium">
              {waitlistData?.length || 0}
            </div>
            <CardTitle className="text-sm font-medium">Standby List</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <p className="text-xs text-gray-600 mb-2 px-2">
            Patients waiting for an appointment. Contact them to fill available gaps.
          </p>
          {waitlistData.length > 0 ? (
            <div className="space-y-0.5">
              {waitlistData.map((item: any) => (
                <div key={item.id || `item-${item.patientId}`} className="px-2 py-1.5 hover:bg-gray-50 rounded border-b last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-2 rounded-full bg-blue-600 text-white w-7 h-7 flex items-center justify-center text-xs">
                        {item.patient?.avatarInitials || ''}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.patient?.firstName || ''} {item.patient?.lastName || ''}</p>
                        <p className="text-xs text-gray-500">{item.requestedProcedure || ''}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-7 px-3">Contact</Button>
                      <Badge variant="outline" className="text-xs mt-1">
                        Available afternoons
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No patients on standby list</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
