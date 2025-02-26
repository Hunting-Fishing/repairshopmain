
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { format } from "date-fns";

interface TimeSlotProps {
  isPast: boolean;
  isCurrentTimeSlot?: boolean;
  hasBookings?: boolean;
  pastColors: [string, string];
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  startTime?: Date;
  endTime?: Date;
}

export function TimeSlot({
  isPast,
  isCurrentTimeSlot,
  hasBookings,
  pastColors,
  onClick,
  children,
  className,
  startTime,
  endTime
}: TimeSlotProps) {
  const [primaryColor, secondaryColor] = pastColors;
  
  const timeSlotLabel = startTime && endTime 
    ? `Time slot from ${format(startTime, 'h:mm a')} to ${format(endTime, 'h:mm a')}${isPast ? ' - Past time slot' : ''}${hasBookings ? ' - Has existing bookings' : ''}`
    : 'Time slot';

  const interactiveProps = onClick ? {
    role: "button",
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
      // Add arrow key navigation
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const slots = document.querySelectorAll('[role="button"]');
        const currentIndex = Array.from(slots).indexOf(e.currentTarget);
        const nextIndex = e.key === 'ArrowUp' ? currentIndex - 1 : currentIndex + 1;
        
        if (nextIndex >= 0 && nextIndex < slots.length) {
          (slots[nextIndex] as HTMLElement).focus();
        }
      }
    },
    onFocus: () => {
      if (!isPast && startTime && endTime) {
        // Announce time slot details to screen readers
        const announcement = `Selected time slot: ${format(startTime, 'h:mm a')} to ${format(endTime, 'h:mm a')}`;
        const liveRegion = document.getElementById('time-slot-live-region');
        if (liveRegion) {
          liveRegion.textContent = announcement;
        }
      }
    }
  } : {};

  return (
    <>
      <div
        {...interactiveProps}
        className={cn(
          "group relative transition-colors outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          hasBookings && "bg-accent/5",
          !hasBookings && !isPast && "hover:bg-accent cursor-pointer",
          !hasBookings && isPast && "cursor-not-allowed opacity-50",
          className
        )}
        style={{
          backgroundColor: isPast ? `${primaryColor}15` : undefined,
          borderColor: isPast ? secondaryColor : undefined
        }}
        onClick={!isPast ? onClick : undefined}
        aria-label={timeSlotLabel}
        aria-disabled={isPast}
        aria-current={isCurrentTimeSlot ? "time" : undefined}
        aria-busy={hasBookings}
      >
        {children}
        {isCurrentTimeSlot && (
          <div 
            className="absolute left-0 w-1 h-full bg-primary rounded-l-lg" 
            aria-hidden="true"
          />
        )}
      </div>
      <div 
        id="time-slot-live-region" 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      />
    </>
  );
}
