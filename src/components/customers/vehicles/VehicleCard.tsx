import { Car, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vehicle } from "./types";
import { VehicleDetails } from "./VehicleDetails";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VehicleActions } from "./VehicleActions";
import { DeleteVehicleDialog } from "./DeleteVehicleDialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface VehicleCardProps {
  vehicle: Vehicle;
  onInfoRequest: (type: 'recalls' | 'safety' | 'complaints') => void;
  onVehicleRemoved?: () => void;
  onVehicleSelect?: (vehicle: Vehicle) => void;
  selectable?: boolean;
}

export const VehicleCard = ({ 
  vehicle, 
  onInfoRequest, 
  onVehicleRemoved,
  onVehicleSelect,
  selectable = false 
}: VehicleCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicle.id);

      if (error) throw error;
      toast({
        title: "Vehicle removed",
        description: "The vehicle has been successfully removed.",
      });
      onVehicleRemoved?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error removing vehicle",
        description: error.message,
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleClick = () => {
    if (selectable && onVehicleSelect) {
      onVehicleSelect(vehicle);
    }
  };

  return (
    <>
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className={`border rounded-lg p-4 space-y-4 ${
          selectable 
            ? 'cursor-pointer hover:bg-secondary/50 transition-colors'
            : ''
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Car className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-medium text-xl">
                {vehicle.year && `${vehicle.year} `}{vehicle.make} {vehicle.model}
              </h3>
              {vehicle.trim && (
                <p className="text-muted-foreground text-sm">{vehicle.trim} Trim</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <VehicleActions 
              onInfoRequest={onInfoRequest}
              onDeleteClick={() => setShowDeleteDialog(true)}
            />
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="space-y-4">
          <VehicleDetails vehicle={vehicle} />
        </CollapsibleContent>
      </Collapsible>

      <DeleteVehicleDialog 
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </>
  );
};