
import { useState, useMemo } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useCalendarBookings } from "@/hooks/useCalendarBookings";
import { DashboardHeader } from "./DashboardHeader";
import { CalendarContainer } from "./calendar/CalendarContainer";
import { GridView } from "./views/GridView";
import { ListView } from "./views/ListView";
import { useViewState } from "@/hooks/useViewState";
import { useUserProfile } from "./hooks/useUserProfile";
import { LoadingScreen } from "./components/LoadingScreen";
import { DashboardContainer } from "./components/DashboardContainer";
import { CalendarBookingHandler } from "./components/CalendarBookingHandler";

export function DashboardLayout() {
  const { viewState, updateViewState } = useViewState('dashboard');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">(viewState.defaultView || "day");
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(viewState.isCalendarExpanded || false);
  const [viewMode, setViewMode] = useState<"calendar" | "grid" | "list">(viewState.viewMode || "calendar");

  const { userProfile, isLoading: isProfileLoading } = useUserProfile();
  const { data: bookings, isLoading: isBookingsLoading, error } = useCalendarBookings(selectedDate);

  const isModernTheme = useMemo(() => true, []);

  const toggleCalendarSize = () => {
    const newExpandedState = !isCalendarExpanded;
    setIsCalendarExpanded(newExpandedState);
    updateViewState({ isCalendarExpanded: newExpandedState });
  };

  const handleViewModeChange = (newMode: "calendar" | "grid" | "list") => {
    setViewMode(newMode);
    updateViewState({ viewMode: newMode });
  };

  const handleViewChange = (newView: "day" | "week" | "month") => {
    setView(newView);
    updateViewState({ defaultView: newView });
  };

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
            <DashboardHeader 
              viewMode={viewMode} 
              onViewChange={handleViewModeChange}
            />
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
          onValueChange={(value) => handleViewModeChange(value as "calendar" | "grid" | "list")}
          className="space-y-6"
        >
          <TabsContent value="calendar" className="mt-0">
            <CalendarContainer
              selectedDate={selectedDate}
              view={view}
              bookings={bookings || []}
              isLoading={isBookingsLoading}
              isCalendarExpanded={isCalendarExpanded}
              onDateChange={(date) => date && setSelectedDate(date)}
              onViewChange={handleViewChange}
              toggleCalendarSize={toggleCalendarSize}
              colorPreferences={userProfile?.color_preferences || {
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
      </DashboardContainer>
    </ErrorBoundary>
  );
}
