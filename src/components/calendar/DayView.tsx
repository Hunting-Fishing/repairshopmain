
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarViewProps } from "@/types/calendar";
import { ColorPalette, PAST_APPOINTMENT_COLORS } from "./ColorPalette";
import { TimeSlot } from "./TimeSlot";
import { TimeSlotContent } from "./TimeSlotContent";
import { 
  generateTimeSlots, 
  isPastTimeSlot, 
  isCurrentTimeSlot,
  TimeSlotData 
} from "./utils/timeSlotUtils";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { LoadingScreen } from "../dashboard/components/LoadingScreen";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Badge } from "../ui/badge";

export function DayView({
  date,
  bookings,
  isLoading,
  onTimeSlotClick,
}: CalendarViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const parentRef = React.useRef<HTMLDivElement>(null);

  // Memoize time slots generation
  const generateTimeSlotsCallback = useCallback(async () => {
    setIsLoadingSlots(true);
    setError(null);
    try {
      const slots = await generateTimeSlots(date, bookings);
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error generating time slots:', error);
      setError(error instanceof Error ? error : new Error('Failed to load time slots'));
    } finally {
      setIsLoadingSlots(false);
    }
  }, [date, bookings]);

  // Update current time every minute with debounce
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      if (Math.abs(now.getTime() - currentTime.getTime()) >= 60000) {
        setCurrentTime(now);
      }
    };
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, [currentTime]);

  // Generate time slots when date or bookings change
  useEffect(() => {
    generateTimeSlotsCallback();
  }, [generateTimeSlotsCallback]);

  // Memoize virtualizer configuration
  const estimateSize = useCallback(() => 64, []);
  
  const virtualizer = useVirtualizer({
    count: timeSlots.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan: 5,
  });

  const renderMultiDayIndicator = useCallback((booking: any) => {
    if (!booking.is_multi_day) return null;
    return (
      <Badge 
        variant="secondary" 
        className="ml-2 text-xs animate-fade-in"
      >
        {booking.sequence_number > 1 ? 'Continued' : 'Multi-day'} 
        {booking.remaining_minutes ? ` (${Math.ceil(booking.remaining_minutes / 60)}h remaining)` : ''}
      </Badge>
    );
  }, []);

  if (isLoading || isLoadingSlots) {
    return (
      <div className="space-y-4 transition-all duration-300 ease-in-out animate-fade-in">
        <div className="h-[calc(100vh-320px)] min-h-[500px] max-h-[800px] overflow-hidden rounded-lg border">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (error) {
    throw error;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4 transition-all duration-300 ease-in-out">
        <div 
          ref={parentRef}
          className="h-[calc(100vh-320px)] min-h-[500px] max-h-[800px] overflow-y-auto backdrop-blur-sm bg-background/95 rounded-lg border shadow-sm transition-all duration-300"
          style={{ willChange: 'transform' }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
            className="transition-all duration-300"
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const slot = timeSlots[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                    willChange: 'transform',
                  }}
                  className="transition-transform duration-300 ease-in-out animate-fade-in"
                >
                  <TimeSlot
                    isPast={isPastTimeSlot(slot.time, currentTime)}
                    isCurrentTimeSlot={isCurrentTimeSlot(slot.time, slot.end, currentTime)}
                    hasBookings={slot.bookings.length > 0}
                    pastColors={[PAST_APPOINTMENT_COLORS[0], PAST_APPOINTMENT_COLORS[1]]}
                    onClick={() => onTimeSlotClick(slot.time, slot.end)}
                    className="flex min-h-[4rem] items-start gap-4 rounded-lg border p-3 m-1 transition-all duration-300 hover:shadow-md"
                  >
                    <TimeSlotContent
                      slot={slot}
                      isPast={isPastTimeSlot(slot.time, currentTime)}
                      pastColors={[PAST_APPOINTMENT_COLORS[0], PAST_APPOINTMENT_COLORS[1]]}
                      renderExtra={(booking) => renderMultiDayIndicator(booking)}
                    />
                  </TimeSlot>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
