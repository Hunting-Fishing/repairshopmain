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
        "relative rounded-md border px-2 py-1 shadow-sm",
        booking.status === "completed" && "border-status-completed bg-status-completed/10",
        booking.status === "in_progress" && "border-status-inProgress bg-status-inProgress/10",
        booking.status === "cancelled" && "border-status-cancelled bg-status-cancelled/10",
        booking.status === "scheduled" && "border-status-pending bg-status-pending/10"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium truncate">{booking.customer_name}</span>
        <Badge
          variant="secondary"
          className={cn(
            "capitalize text-[10px] px-1 font-medium",
            booking.status === "completed" && "bg-status-completed/20 text-status-completed",
            booking.status === "in_progress" && "bg-status-inProgress/20 text-status-inProgress",
            booking.status === "cancelled" && "bg-status-cancelled/20 text-status-cancelled",
            booking.status === "scheduled" && "bg-status-pending/20 text-status-pending"
          )}
        >
          {booking.status.replace("_", " ")}
        </Badge>
      </div>
      {!compact && (
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{format(new Date(booking.start_time), "HH:mm")}</span>
          <span>•</span>
          <span className="truncate">{booking.vehicle_info}</span>
        </div>
      )}
    </div>
  );
}