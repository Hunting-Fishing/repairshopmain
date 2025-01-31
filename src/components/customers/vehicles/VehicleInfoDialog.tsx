import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Vehicle } from "./types";
import { VehicleInfoContent } from "./VehicleInfoContent";

interface VehicleInfoDialogProps {
  vehicle: Vehicle | null;
  infoType: 'recalls' | 'safety' | 'complaints' | null;
  onClose: () => void;
}

export const VehicleInfoDialog = ({ vehicle, infoType, onClose }: VehicleInfoDialogProps) => {
  const [vehicleInfo, setVehicleInfo] = useState<any>(null);
  const { toast } = useToast();

  const fetchVehicleInfo = async () => {
    if (!vehicle || !infoType) return;
    
    try {
      const response = await fetch('https://agtjuxiysmzhmpnbuzmc.supabase.co/functions/v1/vehicle-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: infoType,
          vin: vehicle.vin,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
        }),
      });

      const data = await response.json();
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
          <DialogTitle>
            {infoType === 'recalls' && 'Recall Information'}
            {infoType === 'safety' && 'Safety Ratings'}
            {infoType === 'complaints' && 'Consumer Complaints'}
            {vehicle && ` - ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          </DialogTitle>
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