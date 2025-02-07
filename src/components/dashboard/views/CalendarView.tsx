
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { StatsCards } from "../StatsCards";
import { CalendarSection } from "../CalendarSection";
import { cn } from "@/lib/utils";

interface ColorPreferences {
  primary_color: string;
  secondary_color: string;
  border_color: string;
  background_color: string;
}

interface CalendarViewProps {
  selectedDate: Date;
  view: "day" | "week" | "month";
  bookings: any[];
  isLoading: boolean;
  isCalendarExpanded: boolean;
  onDateChange: (date: Date | undefined) => void;
  onViewChange: (view: "day" | "week" | "month") => void;
  onTimeSlotClick: (start: Date, end: Date) => void;
  toggleCalendarSize: () => void;
  colorPreferences: ColorPreferences;
}

export function CalendarView({
  selectedDate,
  view,
  bookings,
  isLoading,
  isCalendarExpanded,
  onDateChange,
  onViewChange,
  onTimeSlotClick,
  toggleCalendarSize,
  colorPreferences,
}: CalendarViewProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <StatsCards />
      </Card>

      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleCalendarSize}
            className="flex items-center gap-2"
          >
            {isCalendarExpanded ? (
              <>
                <Minimize2 className="h-4 w-4" />
                Compact View
              </>
            ) : (
              <>
                <Maximize2 className="h-4 w-4" />
                Expand Calendar
              </>
            )}
          </Button>
        </div>

        <CalendarSection
          selectedDate={selectedDate}
          view={view}
          bookings={bookings || []}
          isLoading={isLoading}
          onDateChange={onDateChange}
          onViewChange={onViewChange}
          onTimeSlotClick={onTimeSlotClick}
        />
      </div>
    </div>
  );
}
