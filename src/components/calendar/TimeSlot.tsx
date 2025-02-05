
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TimeSlotProps {
  isPast: boolean;
  isCurrentTimeSlot?: boolean;
  hasBookings?: boolean;
  pastColors: [string, string];
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

export function TimeSlot({
  isPast,
  isCurrentTimeSlot,
  hasBookings,
  pastColors,
  onClick,
  children,
  className
}: TimeSlotProps) {
  const [primaryColor, secondaryColor] = pastColors;
  
  return (
    <div
      className={cn(
        "group relative transition-colors",
        hasBookings && "bg-accent/5",
        !hasBookings && "hover:bg-accent cursor-pointer",
        className
      )}
      style={{
        backgroundColor: isPast ? `${primaryColor}15` : undefined,
        borderColor: isPast ? secondaryColor : undefined
      }}
      onClick={onClick}
    >
      {children}
      {isCurrentTimeSlot && (
        <div className="absolute left-0 w-1 h-full bg-primary rounded-l-lg" />
      )}
    </div>
  );
}
