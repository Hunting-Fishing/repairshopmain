import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface CalendarNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

export function CalendarNavigation({
  selectedDate,
  onDateChange,
}: CalendarNavigationProps) {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {format(selectedDate, "MMMM yyyy")}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const prevDay = new Date(selectedDate);
                prevDay.setDate(prevDay.getDate() - 1);
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
                nextDay.setDate(nextDay.getDate() + 1);
                onDateChange(nextDay);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
}