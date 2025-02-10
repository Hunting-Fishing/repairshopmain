
import { memo } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CalendarContainer } from "./calendar/CalendarContainer";
import { GridView } from "./views/GridView";
import { ListView } from "./views/ListView";
import { StatsCards } from "./StatsCards";
import { SystemStatusCard } from "./components/SystemStatusCard";
import { CalendarBookingHandler } from "./components/CalendarBookingHandler";
import { useDashboard } from "@/contexts/DashboardContext";

export const DashboardContent = memo(function DashboardContent() {
  const { state, actions } = useDashboard();
  const {
    view: { selectedDate, view, viewMode, isCalendarExpanded },
    data: { bookings, profile: userProfile },
    loading: { bookings: isBookingsLoading }
  } = state;
  const { setViewMode, setSelectedDate, setView, setIsCalendarExpanded } = actions;

  const isModernTheme = true;

  return (
    <>
      <div className="grid gap-6 mb-8">
        <StatsCards isModernTheme={isModernTheme} />
        <SystemStatusCard isModernTheme={isModernTheme} />
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
          <CalendarContainer
            selectedDate={selectedDate}
            view={view}
            bookings={bookings}
            isLoading={isBookingsLoading}
            isCalendarExpanded={isCalendarExpanded}
            onDateChange={(date) => date && setSelectedDate(date)}
            onViewChange={setView}
            toggleCalendarSize={() => setIsCalendarExpanded(!isCalendarExpanded)}
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
    </>
  );
});
