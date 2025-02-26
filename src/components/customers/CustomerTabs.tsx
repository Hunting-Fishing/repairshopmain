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
import { TabLoadingSkeleton } from "./loading/TabLoadingSkeleton";
import { TabErrorState } from "./loading/TabErrorState";
import { CustomerFeedback } from "./feedback/CustomerFeedback";
import { LoyaltyTab } from "./loyalty/LoyaltyTab";
import { toast } from "sonner";
import { CustomerRelationships } from "./relationships/CustomerRelationships";

interface CustomerTabsProps {
  customerId: string;
  defaultTab?: string;
}

export function CustomerTabs({ customerId, defaultTab = "details" }: CustomerTabsProps) {
  const { data: customerData, isLoading, error, refetch } = useQuery({
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

  if (isLoading) {
    return <TabLoadingSkeleton />;
  }

  if (error) {
    return (
      <TabErrorState 
        message="Failed to load customer data. Please try again later."
        onRetry={() => {
          toast.promise(refetch(), {
            loading: "Retrying...",
            success: "Successfully loaded customer data",
            error: "Failed to load customer data"
          });
        }}
      />
    );
  }

  return (
    <FormProvider {...form}>
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <div className="mt-6">
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
          
          <TabsContent value="relationships">
            <CustomerTabContent label="Relationships">
              <CustomerRelationships customerId={customerId} />
            </CustomerTabContent>
          </TabsContent>

          <TabsContent value="loyalty">
            <CustomerTabContent label="Loyalty & Rewards">
              <LoyaltyTab />
            </CustomerTabContent>
          </TabsContent>

          <TabsContent value="feedback">
            <CustomerTabContent label="Feedback">
              <CustomerFeedback customerId={customerId} />
            </CustomerTabContent>
          </TabsContent>
        </div>
      </Tabs>
    </FormProvider>
  );
}
