import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarViewProps } from "@/types/calendar";
import { ColorPalette, PAST_APPOINTMENT_COLORS } from "./ColorPalette";
import { TimeSlot } from "./TimeSlot";
import { TimeSlotContent } from "./TimeSlotContent";
import { 
  generateTimeSlots, 
  isPastTimeSlot, 
  isCurrentTimeSlot 
} from "./utils/timeSlotUtils";

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

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const timeSlots = generateTimeSlots(date, bookings);

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
            isPast={isPastTimeSlot(slot.time, currentTime)}
            isCurrentTimeSlot={isCurrentTimeSlot(slot.time, slot.end, currentTime)}
            hasBookings={slot.bookings.length > 0}
            pastColor={selectedPastColor}
            onClick={() => onTimeSlotClick(slot.time, slot.end)}
            className="flex min-h-[4rem] items-start gap-4 rounded-lg border p-3"
          >
            <TimeSlotContent
              slot={slot}
              isPast={isPastTimeSlot(slot.time, currentTime)}
              pastColor={selectedPastColor}
            />
          </TimeSlot>
        ))}
      </div>
    </div>
  );
}