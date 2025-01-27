import { format } from "date-fns";

interface TimeColumnProps {
  hours: number[];
}

export function TimeColumn({ hours }: TimeColumnProps) {
  return (
    <div className="pt-14 space-y-14">
      {hours.map((hour) => (
        <div key={hour} className="text-sm text-muted-foreground -mt-2">
          {format(new Date().setHours(hour, 0), "HH:mm")}
        </div>
      ))}
    </div>
  );
}