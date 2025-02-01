import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerSearchCommand } from "../search/CustomerSearchCommand";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const workOrderSchema = z.object({
  customerId: z.string().min(1, "Customer selection is required"),
  vehicleInfo: z.string().min(1, "Vehicle information is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

export function NewWorkOrderDialog() {
  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      customerId: "",
      vehicleInfo: "",
      jobDescription: "",
    },
  });

  const { data: selectedCustomer } = useQuery({
    queryKey: ["customer", form.watch("customerId")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", form.watch("customerId"))
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!form.watch("customerId"),
  });

  const onSubmit = (data: WorkOrderFormValues) => {
    console.log(data);
    // TODO: Implement work order creation
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Work Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Work Order</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Customer</FormLabel>
                  <CustomerSearchCommand 
                    onSelect={(id) => form.setValue("customerId", id)}
                    className="border-input"
                  />
                  {selectedCustomer && (
                    <div className="mt-2 rounded-md bg-muted p-2 text-sm">
                      <p>Selected: {selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                      {selectedCustomer.phone_number && (
                        <p className="text-muted-foreground">Phone: {selectedCustomer.phone_number}</p>
                      )}
                    </div>
                  )}
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
                    <Input 
                      placeholder="2019 Toyota Camry" 
                      {...field}
                      value={selectedCustomer ? 
                        `${selectedCustomer.vehicle_year || ''} ${selectedCustomer.vehicle_make || ''} ${selectedCustomer.vehicle_model || ''}`.trim() : 
                        field.value
                      }
                    />
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
                    <Textarea 
                      placeholder="Describe the work to be done..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create Work Order</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}