
import { format, isBefore, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface DayHeaderProps {
  date: Date;
  isPast: boolean;
  isToday: boolean;
  pastColor: string;
}

export function DayHeader({ date, isPast, isToday, pastColor }: DayHeaderProps) {
  return (
    <div 
      className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{
        backgroundColor: isPast ? `${pastColor}15` : undefined,
        borderColor: isPast ? pastColor : undefined
      }}
    >
      <div className={cn(
        "border-b border-border px-2 py-3",
        isToday && "border-primary"
      )}>
        <div className="text-sm font-medium">{format(date, "EEE")}</div>
        <div className="text-2xl font-bold">{format(date, "d")}</div>
      </div>
    </div>
  );
}
