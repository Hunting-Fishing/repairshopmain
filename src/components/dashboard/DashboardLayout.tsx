
import { useState, useCallback, useMemo } from "react";
import { BookingDialog } from "@/components/calendar/BookingDialog";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useCalendarBookings } from "@/hooks/useCalendarBookings";
import { DashboardHeader } from "./DashboardHeader";
import { CalendarView } from "./views/CalendarView";
import { GridView } from "./views/GridView";
import { ListView } from "./views/ListView";
import { useUserProfile } from "./hooks/useUserProfile";
import { LoadingScreen } from "./components/LoadingScreen";
import { DashboardContainer } from "./components/DashboardContainer";
import { CalendarBookingHandler } from "./components/CalendarBookingHandler";

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

  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const { data: bookings, isLoading: isBookingsLoading, error } = useCalendarBookings(selectedDate);

  const isModernTheme = useMemo(() => true, []);

  const handleTimeSlotClick = useCallback((start: Date, end: Date) => {
    setSelectedTimeSlot({ start, end });
    setIsBookingDialogOpen(true);
  }, []);

  const handleBookingCreated = useCallback(() => {
    setIsBookingDialogOpen(false);
    setSelectedTimeSlot(null);
  }, []);

  const toggleCalendarSize = useCallback(() => {
    setIsCalendarExpanded(prev => !prev);
  }, []);

  if (error) {
    throw error;
  }

  if (isProfileLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <DashboardContainer isModernTheme={isModernTheme}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <DashboardHeader viewMode={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        <div className="mb-8">
          <CalendarBookingHandler 
            isModernTheme={isModernTheme}
            bookings={bookings}
            isLoading={isBookingsLoading}
          />
        </div>

        <Tabs 
          value={viewMode} 
          onValueChange={(value) => setViewMode(value as "calendar" | "grid" | "list")}
          className="space-y-6"
        >
          <TabsContent value="calendar" className="mt-0">
            <CalendarView
              selectedDate={selectedDate}
              view={view}
              bookings={bookings || []}
              isLoading={isBookingsLoading}
              isCalendarExpanded={isCalendarExpanded}
              onDateChange={(date) => date && setSelectedDate(date)}
              onViewChange={setView}
              onTimeSlotClick={handleTimeSlotClick}
              toggleCalendarSize={toggleCalendarSize}
              colorPreferences={{
                primary_color: "#0EA5E9",
                secondary_color: "#EFF6FF",
                border_color: "#0EA5E9",
                background_color: "bg-background/95"
              }}
              isModernTheme={isModernTheme}
            />
          </TabsContent>

          <TabsContent value="grid" className="mt-0">
            <GridView />
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <ListView />
          </TabsContent>
        </Tabs>

        <BookingDialog
          open={isBookingDialogOpen}
          onOpenChange={setIsBookingDialogOpen}
          selectedTimeSlot={selectedTimeSlot}
          onBookingCreated={handleBookingCreated}
        />
      </DashboardContainer>
    </ErrorBoundary>
  );
}
