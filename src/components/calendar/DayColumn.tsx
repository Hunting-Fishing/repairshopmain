import { format, isSameDay, addHours } from "date-fns";
import { cn } from "@/lib/utils";
import { BookingCard } from "./BookingCard";
import { Booking } from "@/types/calendar";

interface DayColumnProps {
  day: Date;
  hours: number[];
  bookings: Booking[];
  onTimeSlotClick: (start: Date, end: Date) => void;
}

export function DayColumn({ day, hours, bookings, onTimeSlotClick }: DayColumnProps) {
  return (
    <div className="relative min-w-[200px]">
      <div className="sticky top-0 z-10 bg-background pb-2 border-b">
        <div className="text-sm font-medium">{format(day, "EEE d")}</div>
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
                <BookingCard key={booking.id} booking={booking} compact />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}