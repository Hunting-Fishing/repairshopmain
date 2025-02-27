
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useForm, UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerFormSchema } from "../schemas/customerFormSchema";

export function useCustomerTabsData(customerId: string) {
  const { toast } = useToast();

  // Fetch customer data
  const { 
    data: customerData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Set up form with React Hook Form
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customerData || {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      customer_type: "Personal",
    },
    values: customerData,
    mode: "onChange" // Enable real-time validation
  });

  // Handle retry button click in error state
  const handleRetry = async () => {
    toast({ 
      title: "Retrying...",
      description: "Attempting to reload customer data"
    });
    
    try {
      await refetch();
      toast({
        title: "Success!",
        description: "Successfully loaded customer data",
        variant: "default"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load customer data",
        variant: "destructive"
      });
    }
  };

  return {
    customerData,
    isLoading,
    error,
    form,
    handleRetry
  };
}
