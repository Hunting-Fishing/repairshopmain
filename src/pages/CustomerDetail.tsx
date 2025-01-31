import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { VehicleInfoSection } from "@/components/customers/form/VehicleInfoSection";
import { CustomerHistoryList } from "@/components/customers/history/CustomerHistoryList";
import { User, Car, History, Users } from "lucide-react";

export function CustomerDetail() {
  const { customerId } = useParams();

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
                <CardHeader>
                  <CardTitle>Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <VehicleInfoSection form={{ control: {} }} />
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
              <CustomerHistoryList customerId={customerId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}