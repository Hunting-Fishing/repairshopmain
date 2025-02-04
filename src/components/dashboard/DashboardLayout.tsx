import { useState } from "react";
import { BookingDialog } from "@/components/calendar/BookingDialog";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CalendarSection } from "@/components/dashboard/CalendarSection";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useCalendarBookings } from "@/hooks/useCalendarBookings";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, LayoutGrid, Calendar as CalendarIcon, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimeSlot {
  start: Date;
  end: Date;
}

type ViewMode = "calendar" | "grid" | "list";

export function DashboardLayout() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");

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

  return (
    <ErrorBoundary>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <DashboardHeader
            title="Dashboard"
            description="Overview of your repair shop's performance"
          />
          <div className="flex gap-2">
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as ViewMode)}
              className="hidden md:block"
            >
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <TabsContent value="calendar" className="mt-0">
          <div className={cn(
            "grid gap-6",
            isCalendarExpanded ? "" : "grid-cols-1 lg:grid-cols-2"
          )}>
            {!isCalendarExpanded && (
              <Card className="p-6 space-y-6">
                <StatsCards />
              </Card>
            )}

            <div className={cn(
              "transition-all duration-300",
              isCalendarExpanded ? "col-span-full" : ""
            )}>
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleCalendarSize}
                  className="flex items-center gap-2"
                >
                  {isCalendarExpanded ? (
                    <>
                      <Minimize2 className="h-4 w-4" />
                      Compact View
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4" />
                      Expand Calendar
                    </>
                  )}
                </Button>
              </div>

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
          </div>
        </TabsContent>

        <TabsContent value="grid" className="mt-0">
          <div className="grid gap-6">
            <Card className="p-6">
              <StatsCards />
            </Card>
            {/* Add grid view of appointments/tasks here */}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="space-y-6">
            <Card className="p-6">
              <StatsCards />
            </Card>
            {/* Add list view of appointments/tasks here */}
          </div>
        </TabsContent>

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