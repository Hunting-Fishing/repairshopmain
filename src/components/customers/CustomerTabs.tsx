
import { Tabs } from "@/components/ui/tabs";
import { FormProvider } from "react-hook-form";
import { CustomerTabList } from "./tabs/CustomerTabList";
import { CustomerTabContents } from "./tabs/CustomerTabContents";
import { TabLoadingSkeleton } from "./loading/TabLoadingSkeleton";
import { TabErrorState } from "./loading/TabErrorState";
import { useCustomerTabsData } from "./hooks/useCustomerTabsData";

interface CustomerTabsProps {
  customerId: string;
  defaultTab?: string;
}

export function CustomerTabs({ 
  customerId, 
  defaultTab = "details" 
}: CustomerTabsProps) {
  // Use custom hook to fetch data and set up form
  const { 
    isLoading, 
    error, 
    form, 
    handleRetry 
  } = useCustomerTabsData(customerId);

  // Show loading state
  if (isLoading) {
    return <TabLoadingSkeleton />;
  }

  // Show error state with retry button
  if (error) {
    return (
      <TabErrorState 
        message="Failed to load customer data. Please try again later."
        onRetry={handleRetry}
      />
    );
  }

  // Main component UI
  return (
    <FormProvider {...form}>
      <Tabs defaultValue={defaultTab} className="w-full">
        <CustomerTabList />
        <CustomerTabContents 
          customerId={customerId} 
          form={form} 
        />
      </Tabs>
    </FormProvider>
  );
}
