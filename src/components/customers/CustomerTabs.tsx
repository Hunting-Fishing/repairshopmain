
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleList } from "./vehicles/VehicleList";
import { RepairJobsList } from "./repair-jobs/RepairJobsList";
import { CustomerCommunications } from "./communications/CustomerCommunications";
import { CustomerPayments } from "./payments/CustomerPayments";
import { CustomerInspections } from "./inspections/CustomerInspections";
import { CustomerForm } from "./CustomerForm";

interface CustomerTabsProps {
  customerId: string;
  customer: any;
  onSuccess: () => void;
}

export function CustomerTabs({ customerId, customer, onSuccess }: CustomerTabsProps) {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        <TabsTrigger value="repair-jobs">Repair Jobs</TabsTrigger>
        <TabsTrigger value="communications">Communications</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="inspections">Inspections</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <CustomerForm mode="edit" initialData={customer} onSuccess={onSuccess} />
      </TabsContent>

      <TabsContent value="vehicles">
        <VehicleList customerId={customerId} />
      </TabsContent>

      <TabsContent value="repair-jobs">
        <RepairJobsList customerId={customerId} />
      </TabsContent>

      <TabsContent value="communications">
        <CustomerCommunications customerId={customerId} />
      </TabsContent>

      <TabsContent value="payments">
        <CustomerPayments customerId={customerId} />
      </TabsContent>

      <TabsContent value="inspections">
        <CustomerInspections customerId={customerId} />
      </TabsContent>
    </Tabs>
  );
}
