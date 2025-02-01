import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Car, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { VehicleCard } from "./VehicleCard";
import { VehicleInfoDialog } from "./VehicleInfoDialog";
import { Vehicle } from "./types";

interface VehicleListProps {
  customerId: string;
  onVehicleSelect?: (vehicleInfo: string) => void;
}

export const VehicleList = ({ customerId, onVehicleSelect }: VehicleListProps) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [infoType, setInfoType] = useState<'recalls' | 'safety' | 'complaints' | null>(null);
  const queryClient = useQueryClient();

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

  const handleVehicleRemoved = () => {
    queryClient.invalidateQueries({ queryKey: ["vehicles", customerId] });
  };

  const handleVehicleClick = (vehicle: Vehicle) => {
    if (onVehicleSelect) {
      const vehicleInfo = `${vehicle.year} ${vehicle.make} ${vehicle.model}`.trim();
      onVehicleSelect(vehicleInfo);
    }
  };

  if (isLoading) return <div>Loading vehicles...</div>;

  if (!vehicles || vehicles.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No vehicles found for this customer.</AlertDescription>
      </Alert>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            onClick={() => handleVehicleClick(vehicle)}
            className={cn(
              "cursor-pointer transition-colors",
              onVehicleSelect && "hover:bg-accent hover:text-accent-foreground rounded-lg"
            )}
          >
            <VehicleCard
              vehicle={vehicle}
              onInfoRequest={(type) => {
                setSelectedVehicle(vehicle);
                setInfoType(type);
              }}
              onVehicleRemoved={handleVehicleRemoved}
            />
          </div>
        ))}
      </div>

      <VehicleInfoDialog
        vehicle={selectedVehicle}
        infoType={infoType}
        onClose={() => {
          setSelectedVehicle(null);
          setInfoType(null);
        }}
      />
    </ScrollArea>
  );
};