import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

export function CalendarNavigation({
  selectedDate,
  onDateChange,
}: CalendarNavigationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Date</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          className="rounded-md border"
        />
        <div className="mt-4 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onDateChange(new Date())}
          >
            Today
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                const prevDay = new Date(selectedDate);
                prevDay.setDate(prevDay.getDate() - 1);
                onDateChange(prevDay);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                const nextDay = new Date(selectedDate);
                nextDay.setDate(nextDay.getDate() + 1);
                onDateChange(nextDay);
              }}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}