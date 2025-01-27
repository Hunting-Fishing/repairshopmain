import { format, addDays, isSameDay, startOfWeek, addHours } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Booking {
  id: string;
  customer_name: string;
  vehicle_info: string;
  job_description: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
}

interface WeekViewProps {
  date: Date;
  bookings: Booking[];
  isLoading: boolean;
  onTimeSlotClick: (start: Date, end: Date) => void;
}

const WORKING_HOURS = {
  start: 8, // 8 AM
  end: 18, // 6 PM
};

export function WeekView({
  date,
  bookings,
  isLoading,
  onTimeSlotClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(date);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from(
    { length: WORKING_HOURS.end - WORKING_HOURS.start },
    (_, i) => WORKING_HOURS.start + i
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-8 gap-4">
        <div className="pt-14" /> {/* Time column spacing */}
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              {format(day, "EEE d")}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative grid grid-cols-8 gap-4">
      {/* Time column */}
      <div className="pt-14 space-y-14">
        {hours.map((hour) => (
          <div key={hour} className="text-sm text-muted-foreground -mt-2">
            {format(new Date().setHours(hour, 0), "HH:mm")}
          </div>
        ))}
      </div>

      {/* Days columns */}
      {weekDays.map((day) => {
        const dayStart = new Date(day);
        dayStart.setHours(WORKING_HOURS.start, 0, 0, 0);

        return (
          <div key={day.toISOString()} className="relative">
            <div className="sticky top-0 z-10 bg-background pb-2">
              <div className="text-sm font-medium">
                {format(day, "EEE d")}
              </div>
            </div>
            
            <div className="relative space-y-2">
              {hours.map((hour) => {
                const timeSlotStart = new Date(day);
                timeSlotStart.setHours(hour, 0, 0, 0);
                const timeSlotEnd = addHours(timeSlotStart, 1);
                
                const slotBookings = bookings.filter(
                  (booking) =>
                    isSameDay(new Date(booking.start_time), day) &&
                    new Date(booking.start_time) <= timeSlotStart &&
                    new Date(booking.end_time) > timeSlotStart
                );

                return (
                  <div
                    key={timeSlotStart.toISOString()}
                    className={cn(
                      "h-14 w-full cursor-pointer rounded-md border border-dashed p-1 transition-colors hover:border-solid hover:bg-accent",
                      slotBookings.length > 0 && "border-solid bg-accent/50"
                    )}
                    onClick={() => onTimeSlotClick(timeSlotStart, timeSlotEnd)}
                  >
                    {slotBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className={cn(
                          "h-full rounded-sm border px-1 py-0.5 text-xs",
                          booking.status === "completed" &&
                            "border-status-completed bg-status-completed/5",
                          booking.status === "in_progress" &&
                            "border-status-inProgress bg-status-inProgress/5",
                          booking.status === "cancelled" &&
                            "border-status-cancelled bg-status-cancelled/5",
                          booking.status === "scheduled" &&
                            "border-status-pending bg-status-pending/5"
                        )}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-medium truncate">
                            {booking.customer_name}
                          </span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "capitalize text-[10px] px-1",
                              booking.status === "completed" &&
                                "bg-status-completed/10 text-status-completed",
                              booking.status === "in_progress" &&
                                "bg-status-inProgress/10 text-status-inProgress",
                              booking.status === "cancelled" &&
                                "bg-status-cancelled/10 text-status-cancelled",
                              booking.status === "scheduled" &&
                                "bg-status-pending/10 text-status-pending"
                            )}
                          >
                            {booking.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <span className="block truncate text-muted-foreground">
                          {booking.vehicle_info}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}