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
  isModernTheme?: boolean;
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
  isModernTheme = false,
}: CalendarViewProps) {
  const cardClass = isModernTheme
    ? 'bg-gradient-to-br from-white via-blue-50 to-blue-100/30 shadow-lg border border-blue-200/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300'
    : '';

  const buttonClass = isModernTheme
    ? 'bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white hover:from-[#0284C7] hover:to-[#0EA5E9] shadow-md hover:shadow-lg transition-all duration-300'
    : '';

  return (
    <div className="space-y-6">
      <Card className={cn("p-6", cardClass)}>
        <StatsCards isModernTheme={isModernTheme} />
      </Card>

      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant={isModernTheme ? "default" : "outline"}
            size="sm"
            onClick={toggleCalendarSize}
            className={cn("flex items-center gap-2", buttonClass)}
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
          isModernTheme={isModernTheme}
        />
      </div>
    </div>
  );
}
