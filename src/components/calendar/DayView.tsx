
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarViewProps } from "@/types/calendar";
import { ColorPalette } from "./ColorPalette";
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
  const [selectedPastColors, setSelectedPastColors] = useState<[string, string]>(["#808080", "#C0C0C0"]);
  const [activeColorIndex, setActiveColorIndex] = useState<0 | 1>(0);

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
        selectedColors={selectedPastColors}
        onColorSelect={setSelectedPastColors}
        activeColorIndex={activeColorIndex}
        onActiveColorChange={setActiveColorIndex}
      />
      <div className="space-y-2">
        {timeSlots.map((slot) => (
          <TimeSlot
            key={slot.time.toISOString()}
            isPast={isPastTimeSlot(slot.time, currentTime)}
            isCurrentTimeSlot={isCurrentTimeSlot(slot.time, slot.end, currentTime)}
            hasBookings={slot.bookings.length > 0}
            pastColors={selectedPastColors}
            onClick={() => onTimeSlotClick(slot.time, slot.end)}
            className="flex min-h-[4rem] items-start gap-4 rounded-lg border p-3"
          >
            <TimeSlotContent
              slot={slot}
              isPast={isPastTimeSlot(slot.time, currentTime)}
              pastColors={selectedPastColors}
            />
          </TimeSlot>
        ))}
      </div>
    </div>
  );
}
