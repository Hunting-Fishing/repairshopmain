import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface CalendarNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
  view: "day" | "week" | "month";
  onViewChange: (view: "day" | "week" | "month") => void;
}

export function CalendarNavigation({
  selectedDate,
  onDateChange,
  view,
  onViewChange,
}: CalendarNavigationProps) {
  return (
    <Card className="mb-6 border-none shadow-none">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">
            {format(selectedDate, "MMMM yyyy")}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
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
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
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
          >
            Day
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("week")}
          >
            Week
          </Button>
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewChange("month")}
          >
            Month
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}