import { format, addMinutes, isSameDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
    <div className="space-y-1">
      {timeSlots.map((slot) => (
        <div
          key={slot.time.toISOString()}
          className={cn(
            "group flex min-h-[3rem] cursor-pointer items-center gap-2 rounded-md px-3 hover:bg-accent",
            slot.bookings.length > 0 && "bg-accent/50"
          )}
          onClick={() => onTimeSlotClick(slot.time, slot.end)}
        >
          <div className="w-16 text-sm text-muted-foreground">
            {format(slot.time, "HH:mm")}
          </div>
          {slot.bookings.map((booking) => (
            <div
              key={booking.id}
              className={cn(
                "flex-1 rounded-md px-3 py-2",
                booking.status === "completed" && "bg-status-completed/10",
                booking.status === "in_progress" && "bg-status-inProgress/10",
                booking.status === "cancelled" && "bg-status-cancelled/10",
                booking.status === "scheduled" && "bg-status-pending/10"
              )}
            >
              <div className="font-medium">{booking.customer_name}</div>
              <div className="text-sm text-muted-foreground">
                {booking.vehicle_info}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}