
import { format, isBefore, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface DayHeaderProps {
  date: Date;
  isPast: boolean;
  isToday: boolean;
  pastColor: string;
}

export function DayHeader({ date, isPast, isToday, pastColor }: DayHeaderProps) {
  const dayString = format(date, "EEE");
  const dayNumber = format(date, "d");
  const fullDate = format(date, "PPPP");

  return (
    <div 
      className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{
        backgroundColor: isPast ? `${pastColor}15` : undefined,
        borderColor: isPast ? pastColor : undefined
      }}
      role="columnheader"
      aria-label={fullDate}
    >
      <div className={cn(
        "border-b border-border px-2 py-3",
        isToday && "border-primary"
      )}>
        <div 
          className="text-sm font-medium"
          aria-hidden="true"
        >
          {dayString}
        </div>
        <div 
          className="text-2xl font-bold"
          aria-hidden="true"
        >
          {dayNumber}
        </div>
        <span className="sr-only">{fullDate}</span>
      </div>
    </div>
  );
}
