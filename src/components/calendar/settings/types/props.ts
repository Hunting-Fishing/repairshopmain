import { UseFormReturn } from "react-hook-form";
import { CalendarSettingsFormValues } from "./form-schema";

export interface FormSectionProps {
  form: UseFormReturn<CalendarSettingsFormValues>;
}