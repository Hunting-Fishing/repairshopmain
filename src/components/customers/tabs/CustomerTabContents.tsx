
import { TabsContent } from "@/components/ui/tabs";
import { CustomerTabContent } from "../CustomerTabContent";
import { CUSTOMER_TABS } from "../config/tabConfig";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../types/customerTypes";

interface CustomerTabContentsProps {
  customerId: string;
  form: UseFormReturn<CustomerFormValues>;
}

export function CustomerTabContents({ 
  customerId, 
  form 
}: CustomerTabContentsProps) {
  return (
    <div className="mt-6">
      {CUSTOMER_TABS.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          <CustomerTabContent label={tab.label}>
            {tab.requiresForm 
              ? tab.component({ customerId, form }) 
              : tab.component({ customerId })}
          </CustomerTabContent>
        </TabsContent>
      ))}
    </div>
  );
}
