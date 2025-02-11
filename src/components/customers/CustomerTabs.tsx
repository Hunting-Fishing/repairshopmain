import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleList } from "./vehicles/VehicleList";
import { RepairJobsList } from "./repair-jobs/RepairJobsList";
import { CustomerCommunications } from "./communications/CustomerCommunications";
import { CustomerPayments } from "./payments/CustomerPayments";
import { CustomerInspections } from "./inspections/CustomerInspections";
import { LoyaltyTab } from "./loyalty/LoyaltyTab";
import { CustomerForm } from "./CustomerForm";
import { useState } from "react";
import { Vehicle } from "./vehicles/types";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail } from "lucide-react";

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
    if (vehicle) {
      setActiveTab("repair-jobs");
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Contact Actions */}
      <div className="flex items-center gap-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {customer.first_name} {customer.last_name}
            <Badge variant="outline">{customer.customer_type}</Badge>
          </h2>
          {customer.loyalty_tier && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {customer.loyalty_tier} Tier
              </Badge>
              <span className="text-sm text-muted-foreground">
                {customer.loyalty_points} points
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 ml-auto">
          {customer.phone_number && (
            <a 
              href={`tel:${customer.phone_number}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              {customer.phone_number}
            </a>
          )}
          {customer.email && (
            <a 
              href={`mailto:${customer.email}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              {customer.email}
            </a>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="repair-jobs">Repair Jobs</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-sm p-6">
            <CustomerForm mode="edit" initialData={customer} onSuccess={onSuccess} />
          </div>
        </TabsContent>

        <TabsContent value="vehicles">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-sm p-6">
            <VehicleList customerId={customerId} onVehicleSelect={handleVehicleSelect} selectedVehicle={selectedVehicle} />
          </div>
        </TabsContent>

        <TabsContent value="repair-jobs">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-sm p-6">
            <RepairJobsList customerId={customerId} vehicleId={selectedVehicle?.id} />
          </div>
        </TabsContent>

        <TabsContent value="communications">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-sm p-6">
            <CustomerCommunications customerId={customerId} />
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-sm p-6">
            <CustomerPayments customerId={customerId} />
          </div>
        </TabsContent>

        <TabsContent value="inspections">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-sm p-6">
            <CustomerInspections customerId={customerId} />
          </div>
        </TabsContent>

        <TabsContent value="loyalty">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-sm p-6">
            <LoyaltyTab />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
