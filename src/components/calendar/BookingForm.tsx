
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "@/types/bookings";
import { CustomerInfo } from "./form-sections/CustomerInfo";
import { VehicleInfo } from "./form-sections/VehicleInfo";
import { NotificationPreferences } from "./form-sections/NotificationPreferences";
import { DurationInput } from "./form-sections/DurationInput";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface BookingFormProps {
  form: UseFormReturn<BookingFormValues>;
  onSubmit: (values: BookingFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isWorkOrder?: boolean;
}

export function BookingForm({
  form,
  onSubmit,
  onCancel,
  isSubmitting,
  isWorkOrder,
}: BookingFormProps) {
  const handleSubmit = async (values: BookingFormValues) => {
    try {
      // Validate required fields based on booking type
      if (!isWorkOrder) {
        if (!values.customer?.email && !values.customer?.phone) {
          throw new Error("Either email or phone number is required");
        }
        
        if (!values.vehicle?.make || !values.vehicle?.model) {
          throw new Error("Vehicle make and model are required");
        }
      }

      if (!values.duration || values.duration < 15) {
        throw new Error("Duration must be at least 15 minutes");
      }

      await onSubmit(values);
      toast.success(isWorkOrder ? "Work order scheduled" : "Booking created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create booking");
    }
  };

  const { errors } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {errors.root && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        {!isWorkOrder && (
          <>
            <CustomerInfo form={form} />
            <VehicleInfo form={form} />
            <NotificationPreferences form={form} />
          </>
        )}
        
        <DurationInput form={form} />

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || Object.keys(errors).length > 0}
          >
            {isWorkOrder ? 'Schedule Work Order' : 'Create Booking'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
