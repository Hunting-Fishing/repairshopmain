
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerTabContent } from "./CustomerTabContent";
import { CustomerFormFields } from "./form/CustomerFormFields";
import { CustomerDocuments } from "./documents/CustomerDocuments";
import { VehicleList } from "./vehicles/VehicleList";
import { CustomerHistoryList } from "./history/CustomerHistoryList";
import { CustomerAnalyticsDashboard } from "./analytics/CustomerAnalyticsDashboard";
import { CustomerCommunications } from "./communications/CustomerCommunications";
import { useForm, FormProvider } from "react-hook-form";
import { CustomerFormValues } from "./types/customerTypes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerFormSchema } from "./schemas/customerFormSchema";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";

interface CustomerTabsProps {
  customerId: string;
  defaultTab?: string;
}

export function CustomerTabs({ customerId, defaultTab = "details" }: CustomerTabsProps) {
  const { data: customerData, isLoading, error } = useQuery({
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

  const { formState: { isDirty, errors } } = form;

  // Handle form auto-save
  const handleAutoSave = async (values: CustomerFormValues) => {
    try {
      const { error } = await supabase
        .from("customers")
        .update(values)
        .eq("id", customerId);

      if (error) throw error;
      toast.success("Changes saved successfully");
    } catch (err) {
      toast.error("Failed to save changes");
      console.error("Auto-save error:", err);
    }
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load customer data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <FormProvider {...form}>
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fix the validation errors before proceeding.
              </AlertDescription>
            </Alert>
          )}

          <TabsContent value="details">
            <CustomerTabContent label="Customer Details">
              <CustomerFormFields 
                form={form} 
                customerId={customerId}
              />
            </CustomerTabContent>
          </TabsContent>

          <TabsContent value="vehicles">
            <CustomerTabContent label="Vehicles">
              <VehicleList customerId={customerId} />
            </CustomerTabContent>
          </TabsContent>

          <TabsContent value="documents">
            <CustomerTabContent label="Documents">
              <CustomerDocuments customerId={customerId} />
            </CustomerTabContent>
          </TabsContent>

          <TabsContent value="history">
            <CustomerTabContent label="History">
              <CustomerHistoryList customerId={customerId} />
            </CustomerTabContent>
          </TabsContent>

          <TabsContent value="communications">
            <CustomerTabContent label="Communications">
              <CustomerCommunications customerId={customerId} />
            </CustomerTabContent>
          </TabsContent>

          <TabsContent value="analytics">
            <CustomerTabContent label="Analytics">
              <CustomerAnalyticsDashboard customerId={customerId} />
            </CustomerTabContent>
          </TabsContent>
        </div>
      </Tabs>
    </FormProvider>
  );
}
