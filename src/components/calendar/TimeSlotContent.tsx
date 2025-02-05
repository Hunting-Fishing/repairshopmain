
import { format } from "date-fns";
import { BookingCard } from "./BookingCard";
import { TimeSlotData } from "./utils/timeSlotUtils";

interface TimeSlotContentProps {
  slot: TimeSlotData;
  isPast: boolean;
  pastColors: [string, string];
}

export function TimeSlotContent({ slot, isPast, pastColors }: TimeSlotContentProps) {
  const [primaryColor] = pastColors;
  
  return (
    <>
      <div className="w-16 text-sm font-medium text-muted-foreground">
        {format(slot.time, "HH:mm")}
      </div>
      <div className="flex flex-1 flex-wrap gap-2">
        {slot.bookings.map((booking) => (
          <div key={booking.id} className="flex-1">
            <BookingCard 
              booking={booking} 
              isPast={isPast}
              pastColor={primaryColor}
            />
          </div>
        ))}
      </div>
    </>
  );
}
