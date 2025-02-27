
import React, { useState, useEffect } from "react";
import { format, addDays, startOfWeek, endOfWeek, isToday, isSameDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Settings2, Search, Filter, MoreVertical } from "lucide-react";
import { BookingDialog } from "@/components/calendar/BookingDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Booking } from "@/types/calendar";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [technicians, setTechnicians] = useState<{ id: string; name: string; hours_allocated: number }[]>([
    { id: "1", name: "Christian Amland", hours_allocated: 100 },
    { id: "2", name: "Jane Doe", hours_allocated: 100 },
    { id: "3", name: "John Smith", hours_allocated: 100 },
    { id: "4", name: "Michael Mills", hours_allocated: 100 },
    { id: "5", name: "Michaela Gonzalez", hours_allocated: 100 }
  ]);
  const [filteredTechnicians, setFilteredTechnicians] = useState(technicians);
  const [searchQuery, setSearchQuery] = useState("");

  // Generate week days based on selected date
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    if (searchQuery) {
      setFilteredTechnicians(technicians.filter(tech => 
        tech.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } else {
      setFilteredTechnicians(technicians);
    }
  }, [searchQuery, technicians]);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings", format(selectedDate, "yyyy-MM-dd"), view],
    queryFn: async () => {
      try {
        // Get date range based on current view
        const rangeStart = startOfWeek(selectedDate);
        const rangeEnd = endOfWeek(selectedDate);
        
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .gte("start_time", rangeStart.toISOString())
          .lte("start_time", rangeEnd.toISOString())
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

  const handlePreviousWeek = () => {
    setSelectedDate(prevDate => addDays(prevDate, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate(prevDate => addDays(prevDate, 7));
  };

  const navigateToToday = () => {
    setSelectedDate(new Date());
  };

  // Helper to get bookings for a specific day and technician
  const getTechnicianBookingsForDay = (techId: string, day: Date): Booking[] => {
    if (!bookings) return [];
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.start_time);
      return (
        booking.assigned_technician_id === techId && 
        isSameDay(bookingDate, day)
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-[#333] text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Scheduler</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="text-white border-white hover:bg-white/20">
            Color Legend
          </Button>
          <Button variant="outline" className="text-white border-white hover:bg-white/20">
            <Settings2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex border-b">
        <div className="w-full p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {format(weekStart, "d")} - {format(endOfWeek(selectedDate), "d MMMM yyyy")}
            </span>
            <Button variant="outline" size="sm" className="ml-2 flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={navigateToToday}>
              Today
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="default">Publish</Button>
            <Select
              defaultValue={view}
              onValueChange={(value: "day" | "week" | "month") => setView(value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
                <SelectItem value="month">Month View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar with unassigned work */}
        <div className="w-64 border-r overflow-y-auto flex flex-col">
          <div className="p-3 border-b">
            <h2 className="font-semibold mb-2">UNASSIGNED WORK</h2>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search" 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="p-3 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-sm text-muted-foreground">OVERDUE (18)</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 p-3">
            <div className="space-y-4">
              <div className="border rounded p-3 bg-muted/10">
                <div className="flex justify-between">
                  <h4 className="font-medium">Spiral Freezer Preventative Maintenance Checklist</h4>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Spiral Freezer</p>
                <div className="mt-2 text-right">
                  <Button variant="link" size="sm" className="h-6 text-blue-500">view</Button>
                </div>
              </div>
              <div className="border rounded p-3 bg-muted/10">
                <div className="flex justify-between">
                  <h4 className="font-medium">Monthly Conveyor Downtime Inspection</h4>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Alco - Food Processing Line #22</p>
                <div className="mt-2 text-right">
                  <Button variant="link" size="sm" className="h-6 text-blue-500">view</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main calendar grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] min-w-[800px]">
            {/* Header row with days */}
            <div className="sticky top-0 z-10 bg-white border-b">
              <div className="border-r p-2 h-14 flex items-center justify-center font-semibold">
                DEFAULT
              </div>
            </div>
            {weekDays.map((day, index) => (
              <div 
                key={day.toISOString()} 
                className={`sticky top-0 z-10 bg-white border-b border-r p-2 text-center ${isToday(day) ? 'bg-blue-50' : ''}`}
              >
                <div className="font-medium text-blue-600">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][day.getDay()]} {day.getDate()}</div>
              </div>
            ))}

            {/* Rows for each technician */}
            {filteredTechnicians.map((tech) => (
              <React.Fragment key={tech.id}>
                <div className="border-b border-r p-2 sticky left-0 bg-white flex items-center">
                  <div>
                    <div className="font-medium">{tech.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {tech.id}/{tech.hours_allocated} hours allocated
                    </div>
                  </div>
                </div>
                
                {/* Days cells for this technician */}
                {weekDays.map((day) => {
                  const dayBookings = getTechnicianBookingsForDay(tech.id, day);
                  const isCurrentDay = isToday(day);
                  
                  return (
                    <div 
                      key={`${tech.id}-${day.toISOString()}`} 
                      className={`border-b border-r min-h-[80px] p-1 ${isCurrentDay ? 'bg-blue-50' : ''}`}
                      onClick={() => {
                        const start = new Date(day);
                        start.setHours(9, 0, 0);
                        const end = new Date(day);
                        end.setHours(10, 0, 0);
                        handleTimeSlotClick(start, end);
                      }}
                    >
                      {dayBookings.map((booking) => (
                        <div 
                          key={booking.id}
                          className="bg-green-100 border border-green-300 rounded p-1 my-1 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTimeSlotClick(
                              new Date(booking.start_time),
                              new Date(booking.end_time)
                            );
                          }}
                        >
                          {booking.customer_name || 'Scheduled Job'}
                        </div>
                      ))}
                      
                      {/* Example scheduled events - these would be dynamically generated from real data */}
                      {tech.id === "1" && day.getDay() === 4 && (
                        <div className="bg-blue-100 border border-blue-300 rounded p-1 my-1 text-xs">
                          Spiral Freezer Service
                        </div>
                      )}
                      {tech.id === "2" && day.getDay() === 1 && (
                        <div className="bg-blue-100 border border-blue-300 rounded p-1 my-1 text-xs">
                          Monthly Conveyor Inspection
                        </div>
                      )}
                      {tech.id === "3" && day.getDay() === 4 && (
                        <div className="bg-blue-100 border border-blue-300 rounded p-1 my-1 text-xs">
                          Spiral Freezer Service
                        </div>
                      )}
                      {tech.id === "5" && day.getDay() === 3 && (
                        <div className="bg-green-100 border border-green-300 rounded p-1 my-1 text-xs">
                          Conveyor Belt Maintenance
                        </div>
                      )}
                      {tech.id === "5" && day.getDay() === 5 && (
                        <div className="bg-green-100 border border-green-300 rounded p-1 my-1 text-xs">
                          Annual Conveyor Inspection
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
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
