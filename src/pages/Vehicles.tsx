
import { VehicleList } from "@/components/customers/vehicles/VehicleList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Car } from "lucide-react";

export default function Vehicles() {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Car className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Vehicle Management</h1>
                <p className="text-muted-foreground">
                  View and manage customer vehicles
                </p>
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Vehicle List</CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
