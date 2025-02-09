
import { StatsCards } from "../StatsCards";
import { cn } from "@/lib/utils";

interface CalendarBookingHandlerProps {
  isModernTheme: boolean;
  bookings: any[];
  isLoading: boolean;
}

export function CalendarBookingHandler({ 
  isModernTheme,
  bookings,
  isLoading 
}: CalendarBookingHandlerProps) {
  return (
    <div className={cn(
      "rounded-xl p-6",
      isModernTheme 
        ? "bg-white/80 backdrop-blur-lg shadow-lg border border-blue-100/50 dark:bg-background/80 dark:border-border"
        : "bg-white/30 backdrop-blur-lg shadow-xl border border-white/20"
    )}>
      <StatsCards isModernTheme={isModernTheme} />
    </div>
  );
}
