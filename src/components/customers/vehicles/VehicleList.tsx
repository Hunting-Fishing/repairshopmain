import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Car, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: string;
  trim: string;
  body_class: string;
  engine_info: any;
}

interface VehicleListProps {
  customerId: string;
}

export const VehicleList = ({ customerId }: VehicleListProps) => {
  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("customer_id", customerId);

      if (error) throw error;
      return data as Vehicle[];
    },
  });

  if (isLoading) {
    return <div>Loading vehicles...</div>;
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No vehicles found for this customer.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="border rounded-lg p-4 space-y-2 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">VIN</p>
                <p>{vehicle.vin}</p>
              </div>
              {vehicle.trim && (
                <div>
                  <p className="text-muted-foreground">Trim</p>
                  <p>{vehicle.trim}</p>
                </div>
              )}
              {vehicle.body_class && (
                <div>
                  <p className="text-muted-foreground">Body Class</p>
                  <p>{vehicle.body_class}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};