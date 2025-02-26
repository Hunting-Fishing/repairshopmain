
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  title: string;
  description: string;
  date: Date;
  icon: ReactNode;
}

export function TimelineItem({ title, description, date, icon }: TimelineItemProps) {
  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      <div className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
        {icon}
      </div>
      <div className="ml-4">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {new Date(date).toLocaleDateString()} at {new Date(date).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
