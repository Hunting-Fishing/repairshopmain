
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Car, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { VehicleCard } from "./VehicleCard";
import { VehicleInfoDialog } from "./VehicleInfoDialog";
import { Vehicle } from "./types";
import { cn } from "@/lib/utils";

interface VehicleListProps {
  customerId: string;
  onVehicleSelect?: (vehicle: Vehicle | null) => void;
}

export const VehicleList = ({ customerId, onVehicleSelect }: VehicleListProps) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
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

  const handleVehicleSelect = (vehicle: Vehicle) => {
    if (selectedVehicleId === vehicle.id) {
      setSelectedVehicleId(null);
      setSelectedVehicle(null);
      onVehicleSelect?.(null);
    } else {
      setSelectedVehicleId(vehicle.id);
      setSelectedVehicle(vehicle);
      onVehicleSelect?.(vehicle);
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
            className={cn(
              selectedVehicleId === vehicle.id && "ring-2 ring-primary rounded-lg"
            )}
          >
            <VehicleCard
              vehicle={vehicle}
              onInfoRequest={(type) => {
                setSelectedVehicle(vehicle);
                setInfoType(type);
              }}
              onVehicleRemoved={handleVehicleRemoved}
              onVehicleSelect={handleVehicleSelect}
              selectable={true}
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
