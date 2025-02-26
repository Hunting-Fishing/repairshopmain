
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
    ? `Time slot from ${format(startTime, 'h:mm a')} to ${format(endTime, 'h:mm a')}`
    : 'Time slot';

  const interactiveProps = onClick ? {
    role: "button",
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }
  } : {};

  return (
    <div
      {...interactiveProps}
      className={cn(
        "group relative transition-colors",
        hasBookings && "bg-accent/5",
        !hasBookings && !isPast && "hover:bg-accent cursor-pointer",
        !hasBookings && isPast && "cursor-not-allowed",
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
    >
      {children}
      {isCurrentTimeSlot && (
        <div 
          className="absolute left-0 w-1 h-full bg-primary rounded-l-lg" 
          aria-hidden="true"
        />
      )}
    </div>
  );
}
