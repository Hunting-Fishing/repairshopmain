import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Vehicle } from "./types";
import { VehicleInfoContent } from "./VehicleInfoContent";
import { supabase } from "@/integrations/supabase/client";

interface VehicleInfoDialogProps {
  vehicle: Vehicle | null;
  infoType: 'recalls' | 'safety' | 'complaints' | null;
  onClose: () => void;
}

export const VehicleInfoDialog = ({ vehicle, infoType, onClose }: VehicleInfoDialogProps) => {
  const [vehicleInfo, setVehicleInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (vehicle && infoType) {
      fetchVehicleInfo();
    }
  }, [vehicle, infoType]);

  const fetchVehicleInfo = async () => {
    if (!vehicle || !infoType) return;
    
    try {
      // For recalls, prioritize VIN-based lookup if VIN is available
      const useVinLookup = infoType === 'recalls' && vehicle.vin;
      
      console.log('Fetching vehicle info with:', {
        type: useVinLookup ? 'vin_recalls' : infoType,
        vin: vehicle.vin,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        usingVin: useVinLookup
      });

      const { data, error } = await supabase.functions.invoke('vehicle-info', {
        body: {
          type: useVinLookup ? 'vin_recalls' : infoType,
          vin: vehicle.vin,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
        },
      });

      if (error) throw error;
      
      console.log('Vehicle Info Response:', data);
      setVehicleInfo(data);
    } catch (error) {
      console.error('Error fetching vehicle information:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vehicle information",
        variant: "destructive",
      });
    }
  };

  const getDialogTitle = () => {
    if (!vehicle) return '';
    const baseTitle = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    const recallCount = vehicleInfo?.Count || 0;
    
    switch (infoType) {
      case 'recalls':
        return `Recalls (${recallCount}) - ${baseTitle}`;
      case 'safety':
        return `Safety Ratings - ${baseTitle}`;
      case 'complaints':
        return `Consumer Complaints - ${baseTitle}`;
      default:
        return baseTitle;
    }
  };

  return (
    <Dialog 
      open={!!vehicle && !!infoType} 
      onOpenChange={() => {
        onClose();
        setVehicleInfo(null);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <VehicleInfoContent 
            infoType={infoType} 
            vehicleInfo={vehicleInfo} 
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};