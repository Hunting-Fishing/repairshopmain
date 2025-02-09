
import { addMinutes, isSameDay, isAfter, isBefore } from "date-fns";
import { Booking } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";

export interface TimeSlotData {
  time: Date;
  end: Date;
  bookings: Booking[];
}

interface CalendarSettings {
  working_hours_start: number;
  working_hours_end: number;
  time_slot_duration: number;
}

const DEFAULT_SETTINGS: CalendarSettings = {
  working_hours_start: 8,
  working_hours_end: 18,
  time_slot_duration: 30
};

async function fetchCalendarSettings(): Promise<CalendarSettings> {
  try {
    const { data: settings, error } = await supabase
      .from('calendar_settings')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching calendar settings:', error);
      return DEFAULT_SETTINGS;
    }

    if (!settings) {
      return DEFAULT_SETTINGS;
    }

    return {
      working_hours_start: settings.working_hours_start ?? DEFAULT_SETTINGS.working_hours_start,
      working_hours_end: settings.working_hours_end ?? DEFAULT_SETTINGS.working_hours_end,
      time_slot_duration: settings.time_slot_duration ?? DEFAULT_SETTINGS.time_slot_duration
    };
  } catch (error) {
    console.error('Error fetching calendar settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export const generateTimeSlots = async (date: Date, bookings: Booking[]): Promise<TimeSlotData[]> => {
  if (!date || !Array.isArray(bookings)) {
    throw new Error('Invalid parameters provided to generateTimeSlots');
  }

  const settings = await fetchCalendarSettings();
  const timeSlots: TimeSlotData[] = [];
  const startTime = new Date(date);
  startTime.setHours(settings.working_hours_start, 0, 0, 0);

  if (isNaN(startTime.getTime())) {
    throw new Error('Invalid date provided to generateTimeSlots');
  }

  for (
    let time = startTime;
    time.getHours() < settings.working_hours_end;
    time = addMinutes(time, settings.time_slot_duration)
  ) {
    const slotEnd = addMinutes(time, settings.time_slot_duration);
    const slotBookings = bookings.filter(
      (booking) =>
        booking?.start_time &&
        booking?.end_time &&
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

export const isPastTimeSlot = (time: Date, currentTime: Date): boolean => {
  if (!time || !currentTime) return false;
  return isBefore(time, currentTime) && isSameDay(time, currentTime);
};

export const isCurrentTimeSlot = (startTime: Date, endTime: Date, currentTime: Date): boolean => {
  if (!startTime || !endTime || !currentTime) return false;
  return (
    isSameDay(currentTime, startTime) &&
    isAfter(currentTime, startTime) &&
    isBefore(currentTime, endTime)
  );
};
