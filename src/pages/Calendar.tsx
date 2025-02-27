
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookingDialog } from "@/components/calendar/BookingDialog";
import { DayView } from "@/components/calendar/DayView";
import { WeekView } from "@/components/calendar/WeekView";
import { MonthView } from "@/components/calendar/MonthView";
import { CalendarNavigation } from "@/components/calendar/CalendarNavigation";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings", format(selectedDate, "yyyy-MM-dd")],
    queryFn: async () => {
      try {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Set the range based on the current view
        let startDate = startOfDay;
        let endDate = endOfDay;
        
        if (view === "week") {
          // For week view, get 7 days
          const startOfWeek = new Date(selectedDate);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(endOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);
          
          startDate = startOfWeek;
          endDate = endOfWeek;
        } else if (view === "month") {
          // For month view, get entire month
          const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
          startOfMonth.setHours(0, 0, 0, 0);
          
          const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
          endOfMonth.setHours(23, 59, 59, 999);
          
          startDate = startOfMonth;
          endDate = endOfMonth;
        }

        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .gte("start_time", startDate.toISOString())
          .lte("start_time", endDate.toISOString())
          .order("start_time");

        if (error) {
          console.error("Error fetching bookings:", error);
          toast.error("Failed to load bookings");
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error in bookings query:", error);
        toast.error("Failed to process booking data");
        return [];
      }
    },
  });

  const handleTimeSlotClick = (start: Date, end: Date) => {
    setSelectedTimeSlot({ start, end });
    setIsBookingDialogOpen(true);
  };

  const handleBookingCreated = () => {
    setIsBookingDialogOpen(false);
    setSelectedTimeSlot(null);
    toast.success("Booking created successfully");
  };

  const { data: settings } = useQuery({
    queryKey: ["calendar-settings"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('calendar_settings')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching calendar settings:', error);
        return null;
      }

      return data?.calendar_settings || null;
    }
  });

  const workingHours = {
    start: settings?.workingHoursStart ? parseInt(settings.workingHoursStart) : 8,
    end: settings?.workingHoursEnd ? parseInt(settings.workingHoursEnd) : 18,
  };

  const use24HourTime = settings?.use24HourTime ?? false;

  const renderCalendarView = () => {
    const viewProps = {
      date: selectedDate,
      bookings: bookings || [],
      isLoading,
      onTimeSlotClick: handleTimeSlotClick,
      workingHours,
      use24HourTime,
    };

    switch (view) {
      case "week":
        return <WeekView {...viewProps} />;
      case "month":
        return <MonthView {...viewProps} />;
      default:
        return <DayView {...viewProps} />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Manage your repair shop's schedule
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Schedule</CardTitle>
          <CalendarNavigation
            selectedDate={selectedDate}
            onDateChange={(date) => date && setSelectedDate(date)}
            view={view}
            onViewChange={setView}
          />
        </CardHeader>
        <CardContent>
          <ErrorBoundary
            fallback={
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  An error occurred while displaying the calendar. Please try refreshing the page.
                </AlertDescription>
              </Alert>
            }
          >
            {renderCalendarView()}
          </ErrorBoundary>
        </CardContent>
      </Card>

      <BookingDialog
        open={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
        selectedTimeSlot={selectedTimeSlot}
        onBookingCreated={handleBookingCreated}
      />
    </div>
  );
}
