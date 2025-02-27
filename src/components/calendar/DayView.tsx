
import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function DayView({
  date,
  bookings = [],
  isLoading,
  onTimeSlotClick,
  workingHours = { start: 8, end: 18 },
  use24HourTime = false,
}: CalendarViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPastColor, setSelectedPastColor] = useState<[string, string]>([PAST_APPOINTMENT_COLORS[0], `${PAST_APPOINTMENT_COLORS[0]}80`]);
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([]);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Generate time slots when date or bookings change
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        if (!date) return;
        const slots = await generateTimeSlots(date, bookings || []);
        setTimeSlots(slots);
      } catch (error) {
        console.error('Error generating time slots:', error);
      }
    };
    
    fetchTimeSlots();
  }, [date, bookings]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!timeSlots.length) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No time slots available for this date. Please try another date.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <ColorPalette 
        selectedColors={selectedPastColor}
        onColorSelect={setSelectedPastColor}
        activeColorIndex={0}
        onActiveColorChange={() => {}}
      />
      <div className="space-y-4">
        {timeSlots.map((slot) => (
          <TimeSlot
            key={slot.time.toISOString()}
            isPast={isPastTimeSlot(slot.time, currentTime)}
            isCurrentTimeSlot={isCurrentTimeSlot(slot.time, slot.end, currentTime)}
            hasBookings={slot.bookings.length > 0}
            pastColors={selectedPastColor}
            onClick={() => onTimeSlotClick(slot.time, slot.end)}
            startTime={slot.time}
            endTime={slot.end}
            className="flex min-h-[4rem] items-start gap-4 rounded-lg border p-3"
          >
            <TimeSlotContent
              slot={slot}
              isPast={isPastTimeSlot(slot.time, currentTime)}
              pastColors={selectedPastColor}
            />
          </TimeSlot>
        ))}
      </div>
    </div>
  );
}
