
import { StatsCards } from "../StatsCards";

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
    <div className={`rounded-xl ${
      isModernTheme 
        ? 'bg-white/80 backdrop-blur-lg shadow-lg border border-blue-100/50'
        : 'bg-white/30 backdrop-blur-lg shadow-xl border border-white/20'
    } p-6`}>
      <StatsCards isModernTheme={isModernTheme} />
    </div>
  );
}
