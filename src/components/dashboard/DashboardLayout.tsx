import { useState } from "react";
import { BookingDialog } from "@/components/calendar/BookingDialog";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { TabsContent } from "@/components/ui/tabs";
import { useCalendarBookings } from "@/hooks/useCalendarBookings";
import { DashboardHeader } from "./DashboardHeader";
import { CalendarView } from "./views/CalendarView";
import { GridView } from "./views/GridView";
import { ListView } from "./views/ListView";

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
  const [viewMode, setViewMode] = useState<"calendar" | "grid" | "list">("calendar");

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
        <DashboardHeader viewMode={viewMode} onViewChange={setViewMode} />

        <TabsContent value="calendar" className="mt-0">
          <CalendarView
            selectedDate={selectedDate}
            view={view}
            bookings={bookings || []}
            isLoading={isLoading}
            isCalendarExpanded={isCalendarExpanded}
            onDateChange={(date) => date && setSelectedDate(date)}
            onViewChange={setView}
            onTimeSlotClick={handleTimeSlotClick}
            toggleCalendarSize={toggleCalendarSize}
          />
        </TabsContent>

        <TabsContent value="grid" className="mt-0">
          <GridView />
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <ListView />
        </TabsContent>

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