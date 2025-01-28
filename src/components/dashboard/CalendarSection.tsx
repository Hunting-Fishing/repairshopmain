import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayView } from "@/components/calendar/DayView";
import { WeekView } from "@/components/calendar/WeekView";
import { MonthView } from "@/components/calendar/MonthView";
import { CalendarNavigation } from "@/components/calendar/CalendarNavigation";
import { Booking } from "@/types/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarSettingsFormValues } from "../calendar/settings/types";

interface CalendarSectionProps {
  selectedDate: Date;
  view: "day" | "week" | "month";
  bookings: Booking[];
  isLoading: boolean;
  onDateChange: (date: Date | undefined) => void;
  onViewChange: (view: "day" | "week" | "month") => void;
  onTimeSlotClick: (start: Date, end: Date) => void;
}

export function CalendarSection({
  selectedDate,
  view,
  bookings,
  isLoading,
  onDateChange,
  onViewChange,
  onTimeSlotClick,
}: CalendarSectionProps) {
  // Fetch calendar settings
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

      return data?.calendar_settings as CalendarSettingsFormValues | null;
    }
  });

  // Use settings or fallback to defaults
  const workingHours = {
    start: settings?.workingHoursStart ? parseInt(settings.workingHoursStart) : 8,
    end: settings?.workingHoursEnd ? parseInt(settings.workingHoursEnd) : 18,
  };

  const use24HourTime = settings?.use24HourTime ?? false;

  const renderCalendarView = () => {
    const viewProps = {
      date: selectedDate,
      bookings,
      isLoading,
      onTimeSlotClick,
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calendar</CardTitle>
        <CalendarNavigation
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          view={view}
          onViewChange={onViewChange}
        />
      </CardHeader>
      <CardContent>
        {renderCalendarView()}
      </CardContent>
    </Card>
  );
}