
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
  view: "day" | "week" | "month";
  onViewChange: (view: "day" | "week" | "month") => void;
  isModernTheme?: boolean;
}

export function CalendarNavigation({
  selectedDate,
  onDateChange,
  view,
  onViewChange,
  isModernTheme = false,
}: CalendarNavigationProps) {
  const buttonClass = isModernTheme
    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:from-[#7C3AED] hover:to-[#C026D3] shadow-md hover:shadow-lg transition-all duration-300'
    : '';

  const dateClass = isModernTheme
    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent'
    : '';

  return (
    <Card className="mb-6 border-none shadow-none">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h2 className={cn("text-2xl font-semibold", dateClass)}>
            {format(selectedDate, "MMMM yyyy")}
          </h2>
          <div className="flex gap-2">
            <Button
              variant={isModernTheme ? "default" : "outline"}
              size="icon"
              onClick={() => {
                const prevDay = new Date(selectedDate);
                if (view === "day") {
                  prevDay.setDate(prevDay.getDate() - 1);
                } else if (view === "week") {
                  prevDay.setDate(prevDay.getDate() - 7);
                } else {
                  prevDay.setMonth(prevDay.getMonth() - 1);
                }
                onDateChange(prevDay);
              }}
              className={cn("", buttonClass)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={isModernTheme ? "default" : "outline"}
              size="icon"
              onClick={() => {
                const nextDay = new Date(selectedDate);
                if (view === "day") {
                  nextDay.setDate(nextDay.getDate() + 1);
                } else if (view === "week") {
                  nextDay.setDate(nextDay.getDate() + 7);
                } else {
                  nextDay.setMonth(nextDay.getMonth() + 1);
                }
                onDateChange(nextDay);
              }}
              className={cn("", buttonClass)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={view === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("day")}
            className={cn(view === "day" ? buttonClass : "")}
          >
            Day
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("week")}
            className={cn(view === "week" ? buttonClass : "")}
          >
            Week
          </Button>
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("month")}
            className={cn(view === "month" ? buttonClass : "")}
          >
            Month
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
