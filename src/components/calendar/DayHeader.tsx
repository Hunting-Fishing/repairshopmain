
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
  const isWeekend = [0, 6].includes(date.getDay());

  return (
    <div 
      className={cn(
        "sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isWeekend && "bg-accent/5"
      )}
      style={{
        backgroundColor: isPast ? `${pastColor}15` : undefined,
        borderColor: isPast ? pastColor : undefined
      }}
      role="columnheader"
      aria-label={`${fullDate}${isToday ? ' (Today)' : ''}${isWeekend ? ' (Weekend)' : ''}`}
    >
      <div 
        className={cn(
          "border-b border-border px-2 py-3 focus-within:bg-accent/5 transition-colors",
          isToday && "border-primary"
        )}
        tabIndex={0}
        aria-current={isToday ? "date" : undefined}
      >
        <div 
          className={cn(
            "text-sm font-medium",
            isWeekend && "text-muted-foreground"
          )}
          aria-hidden="true"
        >
          {dayString}
        </div>
        <div 
          className={cn(
            "text-2xl font-bold",
            isWeekend && "text-muted-foreground"
          )}
          aria-hidden="true"
        >
          {dayNumber}
        </div>
        <span className="sr-only">
          {`${fullDate}${isToday ? ' - Current day' : ''}${isWeekend ? ' - Weekend' : ''}`}
        </span>
      </div>
    </div>
  );
}
