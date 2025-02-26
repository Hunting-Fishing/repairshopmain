
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
  if (!bookings || bookings.length === 0 || isLoading) return null;

  return (
    <div className={cn(
      "rounded-xl p-6 transition-all duration-300",
      isModernTheme 
        ? "bg-white/80 dark:bg-gray-900/50 backdrop-blur-lg shadow-xl border border-[#E2E8F0]/50 dark:border-blue-900/50"
        : "bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-xl border border-white/20 dark:border-white/10"
    )}>
      {/* Calendar booking content will go here */}
    </div>
  );
}
