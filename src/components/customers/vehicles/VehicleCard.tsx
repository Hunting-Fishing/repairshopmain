import { Car, Shield, FileWarning, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vehicle } from "./types";
import { VehicleDetails } from "./VehicleDetails";

interface VehicleCardProps {
  vehicle: Vehicle;
  onInfoRequest: (type: 'recalls' | 'safety' | 'complaints') => void;
}

export const VehicleCard = ({ vehicle, onInfoRequest }: VehicleCardProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-4 hover:bg-secondary/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-medium text-xl">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            {vehicle.trim && (
              <p className="text-muted-foreground text-sm">
                {vehicle.trim} Trim
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onInfoRequest('recalls')}
          >
            <Shield className="h-4 w-4 mr-2" />
            Recalls
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onInfoRequest('safety')}
          >
            <FileWarning className="h-4 w-4 mr-2" />
            Safety
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onInfoRequest('complaints')}
          >
            <Info className="h-4 w-4 mr-2" />
            Complaints
          </Button>
        </div>
      </div>
      <VehicleDetails vehicle={vehicle} />
    </div>
  );
};