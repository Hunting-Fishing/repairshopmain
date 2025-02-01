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
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, ChevronsUpDown, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

const workOrderSchema = z.object({
  customerId: z.string().min(1, "Customer selection is required"),
  vehicleInfo: z.string().min(1, "Vehicle information is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});

type WorkOrderFormValues = z.infer<typeof workOrderSchema>;

export function NewWorkOrderDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      customerId: "",
      vehicleInfo: "",
      jobDescription: "",
    },
  });

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers", searchQuery],
    queryFn: async () => {
      const query = supabase
        .from("customers")
        .select("id, first_name, last_name, phone_number, vehicle_make, vehicle_model, vehicle_year")
        .order("last_name", { ascending: true });

      if (searchQuery) {
        query.or(
          `first_name.ilike.%${searchQuery}%,` +
          `last_name.ilike.%${searchQuery}%,` +
          `phone_number.ilike.%${searchQuery}%,` +
          `vehicle_make.ilike.%${searchQuery}%,` +
          `vehicle_model.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching customers",
          description: error.message,
        });
        throw error;
      }

      return data;
    },
  });

  const onSubmit = (data: WorkOrderFormValues) => {
    console.log(data);
    // TODO: Implement work order creation
  };

  const selectedCustomer = customers?.find(
    (customer) => customer.id === form.watch("customerId")
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Work Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="justify-between w-full"
                        >
                          {field.value
                            ? selectedCustomer
                              ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
                              : "Select customer"
                            : "Select customer"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search customers..."
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>No customers found.</CommandEmpty>
                          <CommandGroup>
                            {customers?.map((customer) => (
                              <CommandItem
                                key={customer.id}
                                value={customer.id}
                                onSelect={() => {
                                  form.setValue("customerId", customer.id);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === customer.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>
                                    {customer.first_name} {customer.last_name}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {customer.phone_number} •{" "}
                                    {customer.vehicle_year} {customer.vehicle_make}{" "}
                                    {customer.vehicle_model}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                    <Input placeholder="2019 Toyota Camry" {...field} />
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