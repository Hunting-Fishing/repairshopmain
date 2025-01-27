import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { BookingDialog } from "@/components/calendar/BookingDialog";
import { DayView } from "@/components/calendar/DayView";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Manage your repair shop's schedule
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const prevDay = new Date(selectedDate);
                    prevDay.setDate(prevDay.getDate() - 1);
                    setSelectedDate(prevDay);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const nextDay = new Date(selectedDate);
                    nextDay.setDate(nextDay.getDate() + 1);
                    setSelectedDate(nextDay);
                  }}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Schedule</CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </p>
          </CardHeader>
          <CardContent>
            <DayView
              date={selectedDate}
              bookings={bookings || []}
              isLoading={isLoading}
              onTimeSlotClick={handleTimeSlotClick}
            />
          </CardContent>
        </Card>
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