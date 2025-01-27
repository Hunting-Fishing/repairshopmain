import { format, addDays, isSameDay, startOfWeek } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-7 gap-4">
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
    <div className="grid grid-cols-7 gap-4">
      {weekDays.map((day) => {
        const dayBookings = bookings.filter((booking) =>
          isSameDay(new Date(booking.start_time), day)
        );

        return (
          <div key={day.toISOString()} className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              {format(day, "EEE d")}
            </div>
            {dayBookings.map((booking) => (
              <div
                key={booking.id}
                className={cn(
                  "cursor-pointer rounded-md border p-2 text-sm",
                  booking.status === "completed" &&
                    "border-status-completed bg-status-completed/5",
                  booking.status === "in_progress" &&
                    "border-status-inProgress bg-status-inProgress/5",
                  booking.status === "cancelled" &&
                    "border-status-cancelled bg-status-cancelled/5",
                  booking.status === "scheduled" &&
                    "border-status-pending bg-status-pending/5"
                )}
                onClick={() =>
                  onTimeSlotClick(
                    new Date(booking.start_time),
                    new Date(booking.end_time)
                  )
                }
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{booking.customer_name}</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "capitalize",
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
                <span className="text-xs text-muted-foreground">
                  {format(new Date(booking.start_time), "HH:mm")} -{" "}
                  {booking.vehicle_info}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}