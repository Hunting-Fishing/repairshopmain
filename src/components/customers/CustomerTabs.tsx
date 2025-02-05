
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleList } from "./vehicles/VehicleList";
import { RepairJobsList } from "./repair-jobs/RepairJobsList";
import { CustomerCommunications } from "./communications/CustomerCommunications";
import { CustomerPayments } from "./payments/CustomerPayments";
import { CustomerInspections } from "./inspections/CustomerInspections";
import { CustomerForm } from "./CustomerForm";
import { useState } from "react";
import { Vehicle } from "./vehicles/types";

interface CustomerTabsProps {
  customerId: string;
  customer: any;
  onSuccess: () => void;
}

export function CustomerTabs({ customerId, customer, onSuccess }: CustomerTabsProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  const handleVehicleSelect = (vehicle: Vehicle | null) => {
    setSelectedVehicle(vehicle);
    // Auto switch to repair jobs tab when a vehicle is selected
    if (vehicle) {
      setActiveTab("repair-jobs");
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
        <VehicleList customerId={customerId} onVehicleSelect={handleVehicleSelect} selectedVehicle={selectedVehicle} />
      </TabsContent>

      <TabsContent value="repair-jobs">
        <RepairJobsList customerId={customerId} vehicleId={selectedVehicle?.id} />
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
