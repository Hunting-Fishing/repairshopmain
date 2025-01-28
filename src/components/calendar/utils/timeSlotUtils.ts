import { addMinutes, isSameDay, isAfter, isBefore } from "date-fns";
import { Booking } from "@/types/calendar";

export const WORKING_HOURS = {
  start: 8, // 8 AM
  end: 18, // 6 PM
};

export const TIME_SLOT_DURATION = 30; // minutes

export interface TimeSlotData {
  time: Date;
  end: Date;
  bookings: Booking[];
}

export const generateTimeSlots = (date: Date, bookings: Booking[]): TimeSlotData[] => {
  const timeSlots: TimeSlotData[] = [];
  const startTime = new Date(date);
  startTime.setHours(WORKING_HOURS.start, 0, 0, 0);

  for (
    let time = startTime;
    time.getHours() < WORKING_HOURS.end;
    time = addMinutes(time, TIME_SLOT_DURATION)
  ) {
    const slotEnd = addMinutes(time, TIME_SLOT_DURATION);
    const slotBookings = bookings.filter(
      (booking) =>
        isSameDay(new Date(booking.start_time), time) &&
        new Date(booking.start_time) <= time &&
        new Date(booking.end_time) > time
    );

    timeSlots.push({
      time: new Date(time),
      end: slotEnd,
      bookings: slotBookings,
    });
  }

  return timeSlots;
};

export const isPastTimeSlot = (time: Date, currentTime: Date) => {
  return isBefore(time, currentTime) && isSameDay(time, currentTime);
};

export const isCurrentTimeSlot = (startTime: Date, endTime: Date, currentTime: Date) => {
  return (
    isSameDay(currentTime, startTime) &&
    isAfter(currentTime, startTime) &&
    isBefore(currentTime, endTime)
  );
};