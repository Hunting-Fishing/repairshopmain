
import { format, isSameDay, addHours, isBefore, isAfter } from "date-fns";
import { BookingCard } from "./BookingCard";
import { Booking } from "@/types/calendar";
import { TimeSlot } from "./TimeSlot";
import { DayHeader } from "./DayHeader";

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
      <DayHeader 
        date={day}
        isPast={isBefore(day, currentTime)}
        isToday={isSameDay(day, currentTime)}
        pastColor={pastColor}
      />
      
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
            <TimeSlot
              key={timeSlotStart.toISOString()}
              isPast={isPastTimeSlot(timeSlotStart)}
              isCurrentTimeSlot={isCurrentTimeSlot(timeSlotStart, timeSlotEnd)}
              hasBookings={slotBookings.length > 0}
              pastColors={[pastColor, `${pastColor}80`]}
              onClick={() => onTimeSlotClick(timeSlotStart, timeSlotEnd)}
              className="h-14 border-b border-border px-2"
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
            </TimeSlot>
          );
        })}
      </div>
    </div>
  );
}
