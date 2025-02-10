
import { VehicleList } from "@/components/customers/vehicles/VehicleList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Vehicles() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Management</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleList />
        </CardContent>
      </Card>
    </div>
  );
}
