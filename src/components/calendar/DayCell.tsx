
import { format, isSameDay, isSameMonth, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { Booking } from "@/types/calendar";
import { BookingCard } from "./BookingCard";
import { TimeSlot } from "./TimeSlot";

interface DayCellProps {
  day: Date;
  currentDate: Date;
  currentTime: Date;
  bookings: Booking[];
  onTimeSlotClick: (start: Date, end: Date) => void;
  pastColor: string;
}

export function DayCell({
  day,
  currentDate,
  currentTime,
  bookings,
  onTimeSlotClick,
  pastColor,
}: DayCellProps) {
  const dayBookings = bookings.filter((booking) =>
    isSameDay(new Date(booking.start_time), day)
  );

  const isPast = isBefore(day, currentTime);
  const isToday = isSameDay(day, currentTime);

  return (
    <TimeSlot
      isPast={isPast}
      isCurrentTimeSlot={isToday}
      hasBookings={dayBookings.length > 0}
      pastColors={[pastColor, `${pastColor}80`]}
      className={cn(
        "min-h-[8rem] p-2 rounded-lg",
        !isSameMonth(day, currentDate) && "bg-muted/50"
      )}
    >
      <div className="text-sm font-medium mb-2">{format(day, "d")}</div>
      <div className="space-y-1">
        {dayBookings.map((booking) => (
          <div
            key={booking.id}
            onClick={() =>
              onTimeSlotClick(
                new Date(booking.start_time),
                new Date(booking.end_time)
              )
            }
          >
            <BookingCard 
              booking={booking} 
              isPast={isPast}
              pastColor={pastColor}
            />
          </div>
        ))}
      </div>
    </TimeSlot>
  );
}
