import { format, addMinutes, isSameDay, isAfter, isBefore } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarViewProps } from "@/types/calendar";
import { BookingCard } from "./BookingCard";
import { ColorPalette, PAST_APPOINTMENT_COLORS } from "./ColorPalette";
import { TimeSlot } from "./TimeSlot";
import { useState, useEffect } from "react";

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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPastColor, setSelectedPastColor] = useState(PAST_APPOINTMENT_COLORS[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="space-y-4">
      <ColorPalette 
        selectedColor={selectedPastColor}
        onColorSelect={setSelectedPastColor}
      />

      <div className="space-y-2">
        {timeSlots.map((slot) => (
          <TimeSlot
            key={slot.time.toISOString()}
            isPast={isPastTimeSlot(slot.time)}
            isCurrentTimeSlot={isCurrentTimeSlot(slot.time, slot.end)}
            hasBookings={slot.bookings.length > 0}
            pastColor={selectedPastColor}
            onClick={() => onTimeSlotClick(slot.time, slot.end)}
            className="flex min-h-[4rem] items-start gap-4 rounded-lg border p-3"
          >
            <div className="w-16 text-sm font-medium text-muted-foreground">
              {format(slot.time, "HH:mm")}
            </div>
            <div className="flex flex-1 flex-wrap gap-2">
              {slot.bookings.map((booking) => (
                <div key={booking.id} className="flex-1">
                  <BookingCard 
                    booking={booking} 
                    isPast={isPastTimeSlot(new Date(booking.start_time))}
                    pastColor={selectedPastColor}
                  />
                </div>
              ))}
            </div>
          </TimeSlot>
        ))}
      </div>
    </div>
  );
}