import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  customer_name: string;
  vehicle_info: string;
  job_description: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
}

interface MonthViewProps {
  date: Date;
  bookings: Booking[];
  isLoading: boolean;
  onTimeSlotClick: (start: Date, end: Date) => void;
}

export function MonthView({
  date,
  bookings,
  isLoading,
  onTimeSlotClick,
}: MonthViewProps) {
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
                  className={cn(
                    "cursor-pointer rounded-md border p-1 text-xs",
                    booking.status === "completed" &&
                      "border-status-completed bg-status-completed/5",
                    booking.status === "in_progress" &&
                      "border-status-inProgress bg-status-inProgress/5",
                    booking.status === "cancelled" &&
                      "border-status-cancelled bg-status-cancelled/5",
                    booking.status === "scheduled" &&
                      "border-status-pending bg-status-pending/5"
                  )}
                  onClick={() =>
                    onTimeSlotClick(
                      new Date(booking.start_time),
                      new Date(booking.end_time)
                    )
                  }
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-medium truncate">
                      {booking.customer_name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "capitalize text-[10px] px-1",
                        booking.status === "completed" &&
                          "bg-status-completed/10 text-status-completed",
                        booking.status === "in_progress" &&
                          "bg-status-inProgress/10 text-status-inProgress",
                        booking.status === "cancelled" &&
                          "bg-status-cancelled/10 text-status-cancelled",
                        booking.status === "scheduled" &&
                          "bg-status-pending/10 text-status-pending"
                      )}
                    >
                      {booking.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground block truncate">
                    {format(new Date(booking.start_time), "HH:mm")} -{" "}
                    {booking.vehicle_info}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}