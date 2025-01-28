import { z } from "zod";

export const calendarSettingsFormSchema = z.object({
  defaultView: z.enum(["day", "week", "month"]),
  timeFormat: z.enum(["12", "24"]),
  workingHoursStart: z.string(),
  workingHoursEnd: z.string(),
  timeIncrement: z.enum(["15", "30", "60"]),
  theme: z.enum(["light", "dark", "neutral", "warm", "cool"]),
  showOverlappingBookings: z.boolean(),
  allowDoubleBookings: z.boolean(),
  bufferTime: z.enum(["0", "15", "30", "60"]),
  maxAppointmentsPerSlot: z.string(),
});

export type CalendarSettingsFormValues = z.infer<typeof calendarSettingsFormSchema>;