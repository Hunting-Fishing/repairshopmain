import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Booking } from "@/types/calendar";
import { format } from "date-fns";

interface BookingCardProps {
  booking: Booking;
  compact?: boolean;
}

export function BookingCard({ booking, compact = false }: BookingCardProps) {
  return (
    <div
      className={cn(
        "rounded-sm border px-1.5 py-1",
        booking.status === "completed" && "border-status-completed bg-status-completed/5",
        booking.status === "in_progress" && "border-status-inProgress bg-status-inProgress/5",
        booking.status === "cancelled" && "border-status-cancelled bg-status-cancelled/5",
        booking.status === "scheduled" && "border-status-pending bg-status-pending/5"
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="font-medium truncate">{booking.customer_name}</span>
        <Badge
          variant="secondary"
          className={cn(
            "capitalize text-[10px] px-1",
            booking.status === "completed" && "bg-status-completed/10 text-status-completed",
            booking.status === "in_progress" && "bg-status-inProgress/10 text-status-inProgress",
            booking.status === "cancelled" && "bg-status-cancelled/10 text-status-cancelled",
            booking.status === "scheduled" && "bg-status-pending/10 text-status-pending"
          )}
        >
          {booking.status.replace("_", " ")}
        </Badge>
      </div>
      {!compact && (
        <span className="text-[10px] text-muted-foreground block truncate">
          {format(new Date(booking.start_time), "HH:mm")} - {booking.vehicle_info}
        </span>
      )}
    </div>
  );
}