import { useState } from "react";
import { BookingDialog } from "@/components/calendar/BookingDialog";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CalendarSection } from "@/components/dashboard/CalendarSection";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useCalendarBookings } from "@/hooks/useCalendarBookings";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface TimeSlot {
  start: Date;
  end: Date;
}

export function DashboardLayout() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  const { data: bookings, isLoading, error } = useCalendarBookings(selectedDate);

  const handleTimeSlotClick = (start: Date, end: Date) => {
    setSelectedTimeSlot({ start, end });
    setIsBookingDialogOpen(true);
  };

  const handleBookingCreated = () => {
    setIsBookingDialogOpen(false);
    setSelectedTimeSlot(null);
  };

  const toggleCalendarSize = () => {
    setIsCalendarExpanded(!isCalendarExpanded);
  };

  if (error) {
    throw error;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6 animate-fade-in">
        <DashboardHeader
          title="Dashboard"
          description="Overview of your repair shop's performance"
        />

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
              bookings={bookings || []}
              isLoading={isLoading}
              onDateChange={(date) => date && setSelectedDate(date)}
              onViewChange={setView}
              onTimeSlotClick={handleTimeSlotClick}
            />
          </div>
        </div>

        <BookingDialog
          open={isBookingDialogOpen}
          onOpenChange={setIsBookingDialogOpen}
          selectedTimeSlot={selectedTimeSlot}
          onBookingCreated={handleBookingCreated}
        />
      </div>
    </ErrorBoundary>
  );
}