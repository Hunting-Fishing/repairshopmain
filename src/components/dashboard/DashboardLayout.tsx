
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const [isModernTheme, setIsModernTheme] = useState(false);

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
        .select("color_preferences")
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

  const colorPreferences = userProfile?.color_preferences || {
    primary_color: "#F97316",
    secondary_color: "#FDE1D3",
    border_color: "#F97316",
    background_color: "bg-background/95"
  };

  const modernClass = isModernTheme 
    ? 'bg-gradient-to-br from-[#F8FAFC]/80 via-[#EFF6FF] to-[#DBEAFE]/50' 
    : '';

  return (
    <ErrorBoundary>
      <div className={`space-y-6 animate-fade-in p-4 md:p-6 ${modernClass}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <DashboardHeader viewMode={viewMode} onViewChange={setViewMode} />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="theme-toggle" className="text-sm font-medium">
              {isModernTheme ? "Modern" : "Basic"} Theme
            </Label>
            <Switch
              id="theme-toggle"
              checked={isModernTheme}
              onCheckedChange={setIsModernTheme}
              className="data-[state=checked]:bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]"
            />
          </div>
        </div>

        <Tabs 
          value={viewMode} 
          onValueChange={(value) => setViewMode(value as "calendar" | "grid" | "list")}
          className={`${isModernTheme ? 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50' : ''}`}
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
              colorPreferences={colorPreferences}
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
      </div>
    </ErrorBoundary>
  );
}
