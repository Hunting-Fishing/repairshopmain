
import { memo, useCallback, useMemo } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CalendarContainer } from "./calendar/CalendarContainer";
import { GridView } from "./views/GridView";
import { ListView } from "./views/ListView";
import { StatsCards } from "./StatsCards";
import { SystemStatusCard } from "./components/SystemStatusCard";
import { useDashboard } from "@/contexts/DashboardContext";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LoadingScreen } from "./components/LoadingScreen";
import { DashboardBooking } from "@/types/dashboard/consolidated";

// Define proper prop types for CalendarTabContent
interface CalendarTabContentProps {
  selectedDate: Date;
  view: "day" | "week" | "month";
  bookings: DashboardBooking[];
  isBookingsLoading: boolean;
  isCalendarExpanded: boolean;
  onDateChange: (date?: Date) => void;
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

// Memoized TabContent components to prevent unnecessary renders
const CalendarTabContent = memo(function CalendarTabContent({
  selectedDate,
  view,
  bookings,
  isBookingsLoading,
  isCalendarExpanded,
  onDateChange,
  onViewChange,
  toggleCalendarSize,
  colorPreferences,
  isModernTheme,
}: CalendarTabContentProps) {
  return (
    <TabsContent value="calendar" className="mt-0 h-full">
      <CalendarContainer
        selectedDate={selectedDate}
        view={view}
        bookings={bookings}
        isLoading={isBookingsLoading}
        isCalendarExpanded={isCalendarExpanded}
        onDateChange={onDateChange}
        onViewChange={onViewChange}
        toggleCalendarSize={toggleCalendarSize}
        colorPreferences={colorPreferences}
        isModernTheme={isModernTheme}
      />
    </TabsContent>
  );
});

const GridTabContent = memo(function GridTabContent() {
  return (
    <TabsContent value="grid" className="mt-0">
      <GridView />
    </TabsContent>
  );
});

const ListTabContent = memo(function ListTabContent() {
  return (
    <TabsContent value="list" className="mt-0">
      <ListView />
    </TabsContent>
  );
});

// Main DashboardContent component
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

  const handleError = useCallback((error: Error) => {
    console.error("Dashboard error:", error);
  }, []);

  // Memoize color preferences to prevent object recreation
  const colorPreferences = useMemo(() => 
    userProfile?.color_preferences || {
      primary_color: "#0EA5E9",
      secondary_color: "#EFF6FF",
      border_color: "#0EA5E9",
      background_color: "bg-background/95"
    }
  , [userProfile?.color_preferences]);

  // Memoize callback handlers
  const handleDateChange = useCallback((date?: Date) => {
    if (date) setSelectedDate(date);
  }, [setSelectedDate]);

  const handleToggleCalendarSize = useCallback(() => {
    setIsCalendarExpanded(!isCalendarExpanded);
  }, [isCalendarExpanded, setIsCalendarExpanded]);

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
      <div className="flex flex-col min-h-screen space-y-6 animate-fade-in">
        <StatsCards isModernTheme={isModernTheme} />
        
        <Tabs 
          value={viewMode} 
          onValueChange={(value) => setViewMode(value as "calendar" | "grid" | "list")}
          className="space-y-6 flex-1"
        >
          <CalendarTabContent 
            selectedDate={selectedDate}
            view={view}
            bookings={bookings}
            isBookingsLoading={isBookingsLoading}
            isCalendarExpanded={isCalendarExpanded}
            onDateChange={handleDateChange}
            onViewChange={setView}
            toggleCalendarSize={handleToggleCalendarSize}
            colorPreferences={colorPreferences}
            isModernTheme={isModernTheme}
          />

          <GridTabContent />

          <ListTabContent />
        </Tabs>

        <div className="mt-auto pt-6">
          <SystemStatusCard isModernTheme={isModernTheme} />
        </div>
      </div>
    </ErrorBoundary>
  );
});
