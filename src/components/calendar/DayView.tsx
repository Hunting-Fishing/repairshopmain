import { format, addMinutes, isSameDay } from "date-fns";
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

interface DayViewProps {
  date: Date;
  bookings: Booking[];
  isLoading: boolean;
  onTimeSlotClick: (start: Date, end: Date) => void;
}

const WORKING_HOURS = {
  start: 8, // 8 AM
  end: 18, // 6 PM
};

const TIME_SLOT_DURATION = 30; // minutes

export function DayView({
  date,
  bookings,
  isLoading,
  onTimeSlotClick,
}: DayViewProps) {
  const timeSlots = [];
  const startTime = new Date(date);
  startTime.setHours(WORKING_HOURS.start, 0, 0, 0);

  for (
    let time = startTime;
    time.getHours() < WORKING_HOURS.end;
    time = addMinutes(time, TIME_SLOT_DURATION)
  ) {
    const slotEnd = addMinutes(time, TIME_SLOT_DURATION);
    const slotBookings = bookings.filter(
      (booking) =>
        isSameDay(new Date(booking.start_time), time) &&
        new Date(booking.start_time) <= time &&
        new Date(booking.end_time) > time
    );

    timeSlots.push({
      time: new Date(time),
      end: slotEnd,
      bookings: slotBookings,
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {timeSlots.map((slot) => (
        <div
          key={slot.time.toISOString()}
          className={cn(
            "group flex min-h-[4rem] cursor-pointer items-start gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-accent",
            slot.bookings.length > 0 && "bg-accent/50"
          )}
          onClick={() => onTimeSlotClick(slot.time, slot.end)}
        >
          <div className="w-16 text-sm font-medium text-muted-foreground">
            {format(slot.time, "HH:mm")}
          </div>
          <div className="flex flex-1 flex-wrap gap-2">
            {slot.bookings.map((booking) => (
              <div
                key={booking.id}
                className={cn(
                  "flex flex-1 flex-col gap-1 rounded-md border p-2",
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
                <span className="text-sm text-muted-foreground">
                  {booking.vehicle_info}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}