import { format, addMinutes, isSameDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CalendarViewProps } from "@/types/calendar";
import { BookingCard } from "./BookingCard";

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
}: CalendarViewProps) {
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
            "group flex min-h-[4rem] cursor-pointer items-start gap-4 rounded-lg border border-dashed p-3 transition-colors hover:bg-accent",
            slot.bookings.length > 0 && "border-solid bg-accent/50"
          )}
          onClick={() => onTimeSlotClick(slot.time, slot.end)}
        >
          <div className="w-16 text-sm font-medium text-muted-foreground">
            {format(slot.time, "HH:mm")}
          </div>
          <div className="flex flex-1 flex-wrap gap-2">
            {slot.bookings.map((booking) => (
              <div key={booking.id} className="flex-1">
                <BookingCard booking={booking} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}