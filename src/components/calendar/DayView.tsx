import { format, addMinutes, isSameDay, isAfter, isBefore } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CalendarViewProps } from "@/types/calendar";
import { BookingCard } from "./BookingCard";
import { useState, useEffect } from "react";

const WORKING_HOURS = {
  start: 8, // 8 AM
  end: 18, // 6 PM
};

const TIME_SLOT_DURATION = 30; // minutes

const PAST_APPOINTMENT_COLORS = [
  "#9b87f5", // Primary Purple
  "#7E69AB", // Secondary Purple
  "#6E59A5", // Tertiary Purple
  "#F2FCE2", // Soft Green
  "#FEC6A1", // Soft Orange
];

export function DayView({
  date,
  bookings,
  isLoading,
  onTimeSlotClick,
}: CalendarViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPastColor, setSelectedPastColor] = useState(PAST_APPOINTMENT_COLORS[0]);

  // Update current time every minute
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
      <div className="flex items-center gap-2 p-2 bg-background/95 sticky top-0 z-10 border-b">
        <span className="text-sm font-medium">Past appointments color:</span>
        <div className="flex gap-2">
          {PAST_APPOINTMENT_COLORS.map((color) => (
            <button
              key={color}
              className={cn(
                "w-6 h-6 rounded-full border-2",
                selectedPastColor === color ? "border-primary" : "border-transparent"
              )}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedPastColor(color)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {timeSlots.map((slot) => (
          <div
            key={slot.time.toISOString()}
            className={cn(
              "group flex min-h-[4rem] cursor-pointer items-start gap-4 rounded-lg border p-3 transition-colors relative",
              isPastTimeSlot(slot.time) && "border-solid",
              isCurrentTimeSlot(slot.time, slot.end) && 
                "border-primary border-2 bg-primary/5",
              slot.bookings.length > 0 && "border-solid bg-accent/50"
            )}
            style={{
              backgroundColor: isPastTimeSlot(slot.time) 
                ? `${selectedPastColor}15` 
                : undefined,
              borderColor: isPastTimeSlot(slot.time) 
                ? selectedPastColor 
                : undefined
            }}
            onClick={() => onTimeSlotClick(slot.time, slot.end)}
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
            {isCurrentTimeSlot(slot.time, slot.end) && (
              <div className="absolute left-0 w-1 h-full bg-primary rounded-l-lg" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}