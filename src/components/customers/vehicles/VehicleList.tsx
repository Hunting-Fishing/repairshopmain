
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
  customerId?: string;
  onVehicleSelect?: (vehicle: Vehicle | null) => void;
  selectedVehicle: Vehicle | null;
}

export const VehicleList = ({ customerId, onVehicleSelect, selectedVehicle }: VehicleListProps) => {
  const [infoType, setInfoType] = useState<'recalls' | 'safety' | 'complaints' | null>(null);
  const [vehicleForInfo, setVehicleForInfo] = useState<Vehicle | null>(null);
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles", customerId],
    queryFn: async () => {
      let query = supabase.from("vehicles").select("*");
      
      if (customerId) {
        query = query.eq("customer_id", customerId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Vehicle[];
    },
  });

  const handleVehicleRemoved = () => {
    queryClient.invalidateQueries({ queryKey: ["vehicles", customerId] });
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    if (selectedVehicle?.id === vehicle.id) {
      onVehicleSelect?.(null);
    } else {
      onVehicleSelect?.(vehicle);
    }
  };

  if (isLoading) return <div>Loading vehicles...</div>;

  if (!vehicles || vehicles.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {customerId ? "No vehicles found for this customer." : "No vehicles found."}
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
            className={cn(
              selectedVehicle?.id === vehicle.id && "ring-2 ring-primary rounded-lg"
            )}
          >
            <VehicleCard
              vehicle={vehicle}
              onInfoRequest={(type) => {
                setVehicleForInfo(vehicle);
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
        vehicle={vehicleForInfo}
        infoType={infoType}
        onClose={() => {
          setVehicleForInfo(null);
          setInfoType(null);
        }}
      />
    </ScrollArea>
  );
};
