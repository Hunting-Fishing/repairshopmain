
import { format } from "date-fns";

interface TimelineItemProps {
  label: string;
  date: string;
}

export function TimelineItem({ label, date }: TimelineItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground">
        {format(new Date(date), 'PPP')}
      </span>
    </div>
  );
}
