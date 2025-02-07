
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayView } from "@/components/calendar/DayView";
import { WeekView } from "@/components/calendar/WeekView";
import { MonthView } from "@/components/calendar/MonthView";
import { CalendarNavigation } from "@/components/calendar/CalendarNavigation";
import { Booking } from "@/types/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarSettingsFormValues } from "../calendar/settings/types";
import { cn } from "@/lib/utils";

interface CalendarSectionProps {
  selectedDate: Date;
  view: "day" | "week" | "month";
  bookings: Booking[];
  isLoading: boolean;
  onDateChange: (date: Date | undefined) => void;
  onViewChange: (view: "day" | "week" | "month") => void;
  onTimeSlotClick: (start: Date, end: Date) => void;
  isModernTheme?: boolean;
}

export function CalendarSection({
  selectedDate,
  view,
  bookings,
  isLoading,
  onDateChange,
  onViewChange,
  onTimeSlotClick,
  isModernTheme = false,
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

  const workingHours = {
    start: settings?.workingHoursStart ? parseInt(settings.workingHoursStart) : 8,
    end: settings?.workingHoursEnd ? parseInt(settings.workingHoursEnd) : 18,
  };

  const use24HourTime = settings?.use24HourTime ?? false;

  const cardClass = isModernTheme
    ? 'bg-gradient-to-br from-white via-purple-50 to-purple-100/30 shadow-lg border border-purple-200/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300'
    : '';

  const headerClass = isModernTheme
    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent font-bold'
    : '';

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
    <Card className={cn("", cardClass)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className={headerClass}>Calendar</CardTitle>
        <CalendarNavigation
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          view={view}
          onViewChange={onViewChange}
          isModernTheme={isModernTheme}
        />
      </CardHeader>
      <CardContent>
        {renderCalendarView()}
      </CardContent>
    </Card>
  );
}
