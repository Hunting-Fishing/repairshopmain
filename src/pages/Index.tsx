import { useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CalendarNavigation } from "@/components/calendar/CalendarNavigation";
import { DayView } from "@/components/calendar/DayView";
import { WeekView } from "@/components/calendar/WeekView";
import { MonthView } from "@/components/calendar/MonthView";
import { BookingDialog } from "@/components/calendar/BookingDialog";

export default function IndexPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const { toast } = useToast();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings", format(selectedDate, "yyyy-MM-dd")],
    queryFn: async () => {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .gte("start_time", startOfDay.toISOString())
        .lte("start_time", endOfDay.toISOString())
        .order("start_time");

      if (error) {
        toast({
          title: "Error fetching bookings",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
  });

  const handleTimeSlotClick = (start: Date, end: Date) => {
    setSelectedTimeSlot({ start, end });
    setIsBookingDialogOpen(true);
  };

  const handleBookingCreated = () => {
    setIsBookingDialogOpen(false);
    setSelectedTimeSlot(null);
  };

  const renderCalendarView = () => {
    const props = {
      date: selectedDate,
      bookings: bookings || [],
      isLoading,
      onTimeSlotClick: handleTimeSlotClick,
    };

    switch (view) {
      case "week":
        return <WeekView {...props} />;
      case "month":
        return <MonthView {...props} />;
      default:
        return <DayView {...props} />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your repair shop's schedule
          </p>
        </div>
        <Button onClick={() => setIsBookingDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      <CalendarNavigation
        selectedDate={selectedDate}
        onDateChange={(date) => date && setSelectedDate(date)}
        view={view}
        onViewChange={setView}
      />

      <div className="flex-1 overflow-auto rounded-lg border bg-card p-6">
        {renderCalendarView()}
      </div>

      <BookingDialog
        open={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
        selectedTimeSlot={selectedTimeSlot}
        onBookingCreated={handleBookingCreated}
      />
    </div>
  );
}