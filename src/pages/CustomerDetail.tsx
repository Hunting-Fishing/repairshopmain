import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerHistoryList } from "@/components/customers/history/CustomerHistoryList";
import { Button } from "@/components/ui/button";
import { User, Car, History, Users, Shield, FileWarning, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VehicleList } from "@/components/customers/vehicles/VehicleList";
import { AddVehicleForm } from "@/components/customers/vehicles/AddVehicleForm";
import { useState } from "react";

export function CustomerDetail() {
  const { customerId } = useParams();
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!customerId,
  });

  if (isLoading) {
    return <Skeleton className="w-full h-48" />;
  }

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {customer.first_name} {customer.last_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList>
              <TabsTrigger value="info" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </TabsTrigger>
              <TabsTrigger value="vehicles" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Vehicles
              </TabsTrigger>
              <TabsTrigger value="family" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Family Members
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-4">
              <CustomerForm onSuccess={() => {}} initialData={customer} mode="edit" />
            </TabsContent>

            <TabsContent value="vehicles" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Vehicle Information</CardTitle>
                  <div className="flex justify-end">
                    <Button onClick={() => setShowAddVehicle(!showAddVehicle)}>
                      {showAddVehicle ? "Cancel" : "Add Vehicle"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-6">
                      {showAddVehicle && (
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-4">Add New Vehicle</h3>
                          <AddVehicleForm 
                            customerId={customerId!} 
                            onSuccess={() => setShowAddVehicle(false)} 
                          />
                        </div>
                      )}
                      <VehicleList customerId={customerId!} />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="family" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Family Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Family member management coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <CustomerHistoryList customerId={customerId!} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}