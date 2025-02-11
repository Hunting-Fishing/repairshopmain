
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

  // Update current time every minute
  useEffect(() => {
    const updateCurrentTime = () => setCurrentTime(new Date());
    const interval = setInterval(updateCurrentTime, 60000);
    updateCurrentTime();
    return () => clearInterval(interval);
  }, []);

  // Generate time slots when date or bookings change
  useEffect(() => {
    generateTimeSlotsCallback();
  }, [generateTimeSlotsCallback]);

  // Virtual list setup for better performance
  const parentRef = React.useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: timeSlots.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
  });

  const renderMultiDayIndicator = (booking: any) => {
    if (!booking.is_multi_day) return null;
    return (
      <Badge 
        variant="secondary" 
        className="ml-2 text-xs"
      >
        {booking.sequence_number > 1 ? 'Continued' : 'Multi-day'} 
        {booking.remaining_minutes ? ` (${Math.ceil(booking.remaining_minutes / 60)}h remaining)` : ''}
      </Badge>
    );
  };

  if (isLoading || isLoadingSlots) {
    return <LoadingScreen />;
  }

  if (error) {
    throw error;
  }

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <div 
          ref={parentRef}
          className="h-[calc(100vh-200px)] overflow-auto"
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const slot = timeSlots[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <TimeSlot
                    isPast={isPastTimeSlot(slot.time, currentTime)}
                    isCurrentTimeSlot={isCurrentTimeSlot(slot.time, slot.end, currentTime)}
                    hasBookings={slot.bookings.length > 0}
                    pastColors={[PAST_APPOINTMENT_COLORS[0], PAST_APPOINTMENT_COLORS[1]]}
                    onClick={() => onTimeSlotClick(slot.time, slot.end)}
                    className="flex min-h-[4rem] items-start gap-4 rounded-lg border p-3 m-1"
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
