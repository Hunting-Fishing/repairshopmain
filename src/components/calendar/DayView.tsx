
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarViewProps } from "@/types/calendar";
import { ColorPalette, PAST_APPOINTMENT_COLORS } from "./ColorPalette";
import { TimeSlot } from "./TimeSlot";
import { TimeSlotContent } from "./TimeSlotContent";
import { 
  generateTimeSlots, 
  isPastTimeSlot, 
  isCurrentTimeSlot,
  TimeSlotData 
} from "./utils/timeSlotUtils";

export function DayView({
  date,
  bookings,
  isLoading,
  onTimeSlotClick,
}: CalendarViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadTimeSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const slots = await generateTimeSlots(date, bookings);
        setTimeSlots(slots);
      } catch (error) {
        console.error('Error generating time slots:', error);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    loadTimeSlots();
  }, [date, bookings]);

  if (isLoading || isLoadingSlots) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {timeSlots.map((slot) => (
          <TimeSlot
            key={slot.time.toISOString()}
            isPast={isPastTimeSlot(slot.time, currentTime)}
            isCurrentTimeSlot={isCurrentTimeSlot(slot.time, slot.end, currentTime)}
            hasBookings={slot.bookings.length > 0}
            pastColors={[PAST_APPOINTMENT_COLORS[0], PAST_APPOINTMENT_COLORS[1]]}
            onClick={() => onTimeSlotClick(slot.time, slot.end)}
            className="flex min-h-[4rem] items-start gap-4 rounded-lg border p-3"
          >
            <TimeSlotContent
              slot={slot}
              isPast={isPastTimeSlot(slot.time, currentTime)}
              pastColors={[PAST_APPOINTMENT_COLORS[0], PAST_APPOINTMENT_COLORS[1]]}
            />
          </TimeSlot>
        ))}
      </div>
    </div>
  );
}
