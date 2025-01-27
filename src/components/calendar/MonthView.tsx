import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CalendarViewProps } from "@/types/calendar";
import { BookingCard } from "./BookingCard";

export function MonthView({
  date,
  bookings,
  isLoading,
  onTimeSlotClick,
}: CalendarViewProps) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (isLoading) {
    return (
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 31 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-4">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="text-sm font-medium text-muted-foreground text-center pb-2"
        >
          {day}
        </div>
      ))}
      {days.map((day) => {
        const dayBookings = bookings.filter((booking) =>
          isSameDay(new Date(booking.start_time), day)
        );

        return (
          <div
            key={day.toISOString()}
            className={cn(
              "min-h-[8rem] p-2 border rounded-lg",
              !isSameMonth(day, date) && "bg-muted/50"
            )}
          >
            <div className="text-sm font-medium mb-2">{format(day, "d")}</div>
            <div className="space-y-1">
              {dayBookings.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() =>
                    onTimeSlotClick(
                      new Date(booking.start_time),
                      new Date(booking.end_time)
                    )
                  }
                >
                  <BookingCard booking={booking} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}