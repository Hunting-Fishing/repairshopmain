
import { startOfWeek, addDays, format, isBefore, isSameDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeColumn } from "./TimeColumn";
import { DayColumn } from "./DayColumn";
import { CalendarViewProps } from "@/types/calendar";
import { ColorPalette, PAST_APPOINTMENT_COLORS } from "./ColorPalette";
import { useState, useEffect } from "react";

const WORKING_HOURS = {
  start: 8,
  end: 18,
};

export function WeekView({
  date,
  bookings,
  isLoading,
  onTimeSlotClick,
}: CalendarViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPastColor, setSelectedPastColor] = useState<[string, string]>([PAST_APPOINTMENT_COLORS[0], `${PAST_APPOINTMENT_COLORS[0]}80`]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const weekStart = startOfWeek(date);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from(
    { length: WORKING_HOURS.end - WORKING_HOURS.start },
    (_, i) => WORKING_HOURS.start + i
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-8 gap-4">
        <div className="pt-14" />
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              {format(day, "EEE d")}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ))}
      </div>
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
      <div className="relative grid grid-cols-8 gap-0.5 overflow-x-auto bg-muted/20">
        <TimeColumn hours={hours} />
        {weekDays.map((day) => (
          <DayColumn
            key={day.toISOString()}
            day={day}
            hours={hours}
            bookings={bookings}
            onTimeSlotClick={onTimeSlotClick}
            currentTime={currentTime}
            pastColor={selectedPastColor[0]}
          />
        ))}
      </div>
    </div>
  );
}
