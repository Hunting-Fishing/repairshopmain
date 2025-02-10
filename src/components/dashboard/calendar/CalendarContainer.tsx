
import { useState, useCallback } from "react";
import { CalendarView } from "../views/CalendarView";
import { BookingDialog } from "@/components/calendar/BookingDialog";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { Booking } from "@/types/calendar";

interface TimeSlot {
  start: Date;
  end: Date;
}

interface CalendarContainerProps {
  selectedDate: Date;
  view: "day" | "week" | "month";
  bookings: Booking[];
  isLoading: boolean;
  isCalendarExpanded: boolean;
  onDateChange: (date: Date | null) => void;
  onViewChange: (view: "day" | "week" | "month") => void;
  toggleCalendarSize: () => void;
  colorPreferences: {
    primary_color: string;
    secondary_color: string;
    border_color: string;
    background_color: string;
  };
  isModernTheme: boolean;
}

export function CalendarContainer({
  selectedDate,
  view,
  bookings,
  isLoading,
  isCalendarExpanded,
  onDateChange,
  onViewChange,
  toggleCalendarSize,
  colorPreferences,
  isModernTheme,
}: CalendarContainerProps) {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  const handleTimeSlotClick = useCallback((start: Date, end: Date) => {
    setSelectedTimeSlot({ start, end });
    setIsBookingDialogOpen(true);
  }, []);

  const handleBookingCreated = useCallback(() => {
    setIsBookingDialogOpen(false);
    setSelectedTimeSlot(null);
    toast.success("Booking created successfully");
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error("Calendar error:", error);
    toast.error("An error occurred in the calendar view");
  }, []);

  return (
    <ErrorBoundary
      onError={handleError}
      fallback={
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            An error occurred while displaying the calendar. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      }
    >
      <CalendarView
        selectedDate={selectedDate}
        view={view}
        bookings={bookings}
        isLoading={isLoading}
        isCalendarExpanded={isCalendarExpanded}
        onDateChange={onDateChange}
        onViewChange={onViewChange}
        onTimeSlotClick={handleTimeSlotClick}
        toggleCalendarSize={toggleCalendarSize}
        colorPreferences={colorPreferences}
        isModernTheme={isModernTheme}
      />

      <BookingDialog
        open={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
        selectedTimeSlot={selectedTimeSlot}
        onBookingCreated={handleBookingCreated}
      />
    </ErrorBoundary>
  );
}
