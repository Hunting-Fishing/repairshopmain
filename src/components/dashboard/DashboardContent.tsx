
import { memo } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CalendarContainer } from "./calendar/CalendarContainer";
import { GridView } from "./views/GridView";
import { ListView } from "./views/ListView";
import { StatsCards } from "./StatsCards";
import { SystemStatusCard } from "./components/SystemStatusCard";
import { CalendarBookingHandler } from "./components/CalendarBookingHandler";
import { useDashboard } from "@/contexts/DashboardContext";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { LoadingScreen } from "./components/LoadingScreen";

export const DashboardContent = memo(function DashboardContent() {
  const { state, actions } = useDashboard();
  const {
    view: { selectedDate, view, viewMode, isCalendarExpanded },
    data: { bookings, profile: userProfile },
    loading: { bookings: isBookingsLoading, profile: isProfileLoading },
    errors: { bookings: bookingsError, profile: profileError }
  } = state;
  const { setViewMode, setSelectedDate, setView, setIsCalendarExpanded } = actions;

  const isModernTheme = true;
  const isLoading = isBookingsLoading || isProfileLoading;
  const error = bookingsError || profileError;

  const handleError = (error: Error) => {
    console.error("Dashboard error:", error);
    toast("An error occurred in the dashboard");
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load dashboard data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary onError={handleError}>
      <div className="grid gap-6 mb-8">
        <div className="space-y-4">
          <StatsCards isModernTheme={isModernTheme} />
          <SystemStatusCard isModernTheme={isModernTheme} />
          <CalendarBookingHandler 
            isModernTheme={isModernTheme}
            bookings={bookings}
            isLoading={isBookingsLoading}
          />
        </div>
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
    </ErrorBoundary>
  );
});
