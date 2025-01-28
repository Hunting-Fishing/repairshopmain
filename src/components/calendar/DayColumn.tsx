import { format, isSameDay, addHours, isBefore, isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import { BookingCard } from "./BookingCard";
import { Booking } from "@/types/calendar";

interface DayColumnProps {
  day: Date;
  hours: number[];
  bookings: Booking[];
  onTimeSlotClick: (start: Date, end: Date) => void;
  currentTime: Date;
  pastColor: string;
}

export function DayColumn({ 
  day, 
  hours, 
  bookings, 
  onTimeSlotClick,
  currentTime,
  pastColor 
}: DayColumnProps) {
  const isPastTimeSlot = (time: Date) => {
    return isBefore(time, currentTime) && isSameDay(time, currentTime);
  };

  const isCurrentTimeSlot = (startTime: Date, endTime: Date) => {
    return (
      isSameDay(currentTime, startTime) &&
      isAfter(currentTime, startTime) &&
      isBefore(currentTime, endTime)
    );
  };

  return (
    <div className="relative min-w-[200px] border-l border-border first:border-l-0">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="border-b border-border px-2 py-3">
          <div className="text-sm font-medium">{format(day, "EEE")}</div>
          <div className="text-2xl font-bold">{format(day, "d")}</div>
        </div>
      </div>
      
      <div className="relative">
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
                "group relative h-14 border-b border-border px-2 transition-colors",
                slotBookings.length === 0 && "hover:bg-accent cursor-pointer",
                slotBookings.length > 0 && "bg-accent/5",
                isPastTimeSlot(timeSlotStart) && "border-solid"
              )}
              style={{
                backgroundColor: isPastTimeSlot(timeSlotStart) 
                  ? `${pastColor}15` 
                  : undefined,
                borderColor: isPastTimeSlot(timeSlotStart) 
                  ? pastColor 
                  : undefined
              }}
              onClick={() => onTimeSlotClick(timeSlotStart, timeSlotEnd)}
            >
              {slotBookings.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  compact 
                  isPast={isPastTimeSlot(new Date(booking.start_time))}
                  pastColor={pastColor}
                />
              ))}
              {isCurrentTimeSlot(timeSlotStart, timeSlotEnd) && (
                <div className="absolute left-0 w-1 h-full bg-primary rounded-l-lg" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}