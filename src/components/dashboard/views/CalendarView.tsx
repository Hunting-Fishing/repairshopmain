import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { StatsCards } from "../StatsCards";
import { CalendarSection } from "../CalendarSection";
import { cn } from "@/lib/utils";

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
}: CalendarViewProps) {
  return (
    <div className={cn(
      "grid gap-6",
      isCalendarExpanded ? "" : "grid-cols-1 lg:grid-cols-2"
    )}>
      {!isCalendarExpanded && (
        <Card className="p-6 space-y-6">
          <StatsCards />
        </Card>
      )}

      <div className={cn(
        "transition-all duration-300",
        isCalendarExpanded ? "col-span-full" : ""
      )}>
        <div className="flex justify-end mb-4">
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
          bookings={bookings}
          isLoading={isLoading}
          onDateChange={onDateChange}
          onViewChange={onViewChange}
          onTimeSlotClick={onTimeSlotClick}
        />
      </div>
    </div>
  );
}