import { startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarViewProps } from "@/types/calendar";
import { ColorPalette, PAST_APPOINTMENT_COLORS } from "./ColorPalette";
import { useState, useEffect } from "react";
import { MonthGridHeader } from "./MonthGridHeader";
import { DayCell } from "./DayCell";

export function MonthView({
  date,
  bookings,
  isLoading,
  onTimeSlotClick,
}: CalendarViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPastColor, setSelectedPastColor] = useState(PAST_APPOINTMENT_COLORS[0]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 31 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  const days = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });

  return (
    <div className="space-y-4">
      <ColorPalette 
        selectedColor={selectedPastColor}
        onColorSelect={setSelectedPastColor}
      />
      <div className="grid grid-cols-7 gap-4">
        <MonthGridHeader />
        {days.map((day) => (
          <DayCell
            key={day.toISOString()}
            day={day}
            currentDate={date}
            currentTime={currentTime}
            bookings={bookings}
            onTimeSlotClick={onTimeSlotClick}
            pastColor={selectedPastColor}
          />
        ))}
      </div>
    </div>
  );
}