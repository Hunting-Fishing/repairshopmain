import { startOfWeek, addDays, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeColumn } from "./TimeColumn";
import { DayColumn } from "./DayColumn";
import { CalendarViewProps } from "@/types/calendar";

const WORKING_HOURS = {
  start: 8, // 8 AM
  end: 18, // 6 PM
};

export function WeekView({
  date,
  bookings,
  isLoading,
  onTimeSlotClick,
}: CalendarViewProps) {
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
    <div className="relative grid grid-cols-8 gap-0.5 overflow-x-auto bg-muted/20">
      <TimeColumn hours={hours} />
      {weekDays.map((day) => (
        <DayColumn
          key={day.toISOString()}
          day={day}
          hours={hours}
          bookings={bookings}
          onTimeSlotClick={onTimeSlotClick}
        />
      ))}
    </div>
  );
}