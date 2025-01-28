import { format } from "date-fns";

interface TimeColumnProps {
  hours: number[];
}

export function TimeColumn({ hours }: TimeColumnProps) {
  return (
    <div className="relative min-w-[100px] border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="sticky top-0 z-10 h-[72px] border-b border-border" />
      <div className="relative">
        {hours.map((hour) => (
          <div
            key={hour}
            className="relative h-14 border-b border-border px-2"
          >
            <span className="absolute -top-3 right-2 text-sm text-muted-foreground">
              {format(new Date().setHours(hour, 0), "HH:mm")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}