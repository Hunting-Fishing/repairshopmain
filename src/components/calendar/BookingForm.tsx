
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "@/types/bookings";
import { CustomerInfo } from "./form-sections/CustomerInfo";
import { VehicleInfo } from "./form-sections/VehicleInfo";
import { NotificationPreferences } from "./form-sections/NotificationPreferences";

interface BookingFormProps {
  form: UseFormReturn<BookingFormValues>;
  onSubmit: (values: BookingFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function BookingForm({
  form,
  onSubmit,
  onCancel,
  isSubmitting,
}: BookingFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CustomerInfo form={form} />
        <VehicleInfo form={form} />
        <NotificationPreferences form={form} />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Create Booking
          </Button>
        </div>
      </form>
    </Form>
  );
}
