import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { BookingDialog } from "@/components/calendar/BookingDialog";
import { DayView } from "@/components/calendar/DayView";
import { CalendarNavigation } from "@/components/calendar/CalendarNavigation";
import { ClipboardList, DollarSign, Users, Wrench } from "lucide-react";

const stats = [
  {
    title: "Total Work Orders",
    value: "156",
    icon: ClipboardList,
    trend: "+12%",
  },
  {
    title: "Active Customers",
    value: "89",
    icon: Users,
    trend: "+4%",
  },
  {
    title: "Pending Jobs",
    value: "24",
    icon: Wrench,
    trend: "-2%",
  },
  {
    title: "Revenue (MTD)",
    value: "$45,231",
    icon: DollarSign,
    trend: "+8%",
  },
];

export default function Dashboard() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your repair shop's performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.trend.startsWith("+") ? "text-green-500" : "text-red-500"}>
                  {stat.trend}
                </span>
                {" from last month"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Calendar</CardTitle>
            <CalendarNavigation
              selectedDate={selectedDate}
              onDateChange={(date) => date && setSelectedDate(date)}
              view={view}
              onViewChange={setView}
            />
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