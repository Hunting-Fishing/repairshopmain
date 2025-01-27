import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface BookingFormValues {
  customerName: string;
  vehicleInfo: string;
  jobDescription: string;
  assignedTechnicianId: string;
}

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
  const { data: technicians } = useQuery({
    queryKey: ["technicians"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .order("first_name");

      if (error) throw error;
      return data;
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicleInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Information</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignedTechnicianId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Technician</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a technician" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {technicians?.map((technician) => (
                    <SelectItem key={technician.id} value={technician.id}>
                      {technician.first_name} {technician.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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