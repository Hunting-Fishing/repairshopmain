
import { useState } from "react";
import { BookingDialog } from "@/components/calendar/BookingDialog";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useCalendarBookings } from "@/hooks/useCalendarBookings";
import { DashboardHeader } from "./DashboardHeader";
import { CalendarView } from "./views/CalendarView";
import { GridView } from "./views/GridView";
import { ListView } from "./views/ListView";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsCards } from "./StatsCards";

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

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile", session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("theme_preference")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

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

  const isModernTheme = userProfile?.theme_preference === 'modern';

  return (
    <ErrorBoundary>
      <div className={`min-h-screen animate-fade-in bg-gradient-to-br ${
        isModernTheme 
          ? 'from-blue-50 via-white to-blue-50'
          : 'from-background/80 via-background/50 to-background/90'
      } p-4 md:p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <DashboardHeader viewMode={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        <div className="mb-8">
          <StatsCards isModernTheme={isModernTheme} />
        </div>

        <div className={`rounded-xl ${
          isModernTheme 
            ? 'bg-white/80 backdrop-blur-lg shadow-lg border border-blue-100/50'
            : 'bg-white/30 backdrop-blur-lg shadow-xl border border-white/20'
        } p-6`}>
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
                isLoading={isLoading}
                isCalendarExpanded={isCalendarExpanded}
                onDateChange={(date) => date && setSelectedDate(date)}
                onViewChange={setView}
                onTimeSlotClick={handleTimeSlotClick}
                toggleCalendarSize={toggleCalendarSize}
                colorPreferences={{
                  primary_color: isModernTheme ? "#0EA5E9" : "#F97316",
                  secondary_color: isModernTheme ? "#EFF6FF" : "#FDE1D3",
                  border_color: isModernTheme ? "#0EA5E9" : "#F97316",
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
