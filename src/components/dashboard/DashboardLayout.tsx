import { useState } from "react";
import { BookingDialog } from "@/components/calendar/BookingDialog";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CalendarSection } from "@/components/dashboard/CalendarSection";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useCalendarBookings } from "@/hooks/useCalendarBookings";

interface TimeSlot {
  start: Date;
  end: Date;
}

export function DashboardLayout() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  const { data: bookings, isLoading } = useCalendarBookings(selectedDate);

  const handleTimeSlotClick = (start: Date, end: Date) => {
    setSelectedTimeSlot({ start, end });
    setIsBookingDialogOpen(true);
  };

  const handleBookingCreated = () => {
    setIsBookingDialogOpen(false);
    setSelectedTimeSlot(null);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Dashboard"
        description="Overview of your repair shop's performance"
      />

      <StatsCards />

      <div className="grid gap-4">
        <CalendarSection
          selectedDate={selectedDate}
          view={view}
          bookings={bookings || []}
          isLoading={isLoading}
          onDateChange={(date) => date && setSelectedDate(date)}
          onViewChange={setView}
          onTimeSlotClick={handleTimeSlotClick}
        />
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