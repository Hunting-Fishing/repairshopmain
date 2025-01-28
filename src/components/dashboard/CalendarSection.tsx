import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayView } from "@/components/calendar/DayView";
import { CalendarNavigation } from "@/components/calendar/CalendarNavigation";
import { Booking } from "@/types/calendar";

interface CalendarSectionProps {
  selectedDate: Date;
  view: "day" | "week" | "month";
  bookings: Booking[];
  isLoading: boolean;
  onDateChange: (date: Date | undefined) => void;
  onViewChange: (view: "day" | "week" | "month") => void;
  onTimeSlotClick: (start: Date, end: Date) => void;
}

export function CalendarSection({
  selectedDate,
  view,
  bookings,
  isLoading,
  onDateChange,
  onViewChange,
  onTimeSlotClick,
}: CalendarSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calendar</CardTitle>
        <CalendarNavigation
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          view={view}
          onViewChange={onViewChange}
        />
      </CardHeader>
      <CardContent>
        <DayView
          date={selectedDate}
          bookings={bookings}
          isLoading={isLoading}
          onTimeSlotClick={onTimeSlotClick}
        />
      </CardContent>
    </Card>
  );
}