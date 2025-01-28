import { z } from "zod";

export const calendarSettingsFormSchema = z.object({
  defaultView: z.enum(["day", "week", "month"]),
  use24HourTime: z.boolean(),
  workingHoursStart: z.string(),
  workingHoursEnd: z.string(),
  timeIncrement: z.enum(["15", "30", "60"]),
  theme: z.enum(["light", "dark", "neutral", "warm", "cool"]),
  allowOverlappingBookings: z.boolean(),
  bufferBefore: z.enum(["0", "15", "30"]),
  bufferAfter: z.enum(["0", "15", "30"]),
  primaryColor: z.string(),
  secondaryColor: z.string(),
});

export type CalendarSettingsFormValues = z.infer<typeof calendarSettingsFormSchema>;

export interface FormSectionProps {
  form: UseFormReturn<CalendarSettingsFormValues>;
}