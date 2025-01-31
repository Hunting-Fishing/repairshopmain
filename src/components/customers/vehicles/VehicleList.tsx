import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Car, AlertCircle, Shield, FileWarning, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [infoType, setInfoType] = useState<'recalls' | 'safety' | 'complaints' | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<any>(null);
  const { toast } = useToast();

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

  const fetchVehicleInfo = async (vehicle: Vehicle, type: 'recalls' | 'safety' | 'complaints') => {
    try {
      setSelectedVehicle(vehicle);
      setInfoType(type);
      
      const response = await fetch('https://agtjuxiysmzhmpnbuzmc.supabase.co/functions/v1/vehicle-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type,
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

  const renderVehicleInfo = () => {
    if (!vehicleInfo) return null;

    switch (infoType) {
      case 'recalls':
        return (
          <div className="space-y-4">
            {vehicleInfo.results?.map((recall: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg">
                <h4 className="font-medium">{recall.Component}</h4>
                <p className="text-sm text-muted-foreground">{recall.Summary}</p>
                <p className="text-sm mt-2">Consequence: {recall.Consequence}</p>
                <p className="text-sm">Remedy: {recall.Remedy}</p>
              </div>
            ))}
          </div>
        );
      case 'safety':
        return (
          <div className="space-y-4">
            {vehicleInfo.Results?.map((rating: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg">
                <h4 className="font-medium">Overall Rating: {rating.OverallRating}</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <p className="text-sm">Frontal Crash: {rating.FrontalCrashRating}</p>
                  <p className="text-sm">Side Crash: {rating.SideCrashRating}</p>
                  <p className="text-sm">Rollover: {rating.RolloverRating}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 'complaints':
        return (
          <div className="space-y-4">
            {vehicleInfo.results?.map((complaint: any, index: number) => (
              <div key={index} className="border p-4 rounded-lg">
                <h4 className="font-medium">{complaint.components}</h4>
                <p className="text-sm text-muted-foreground">{complaint.summary}</p>
                <p className="text-sm mt-2">Date: {complaint.dateOfIncident}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fetchVehicleInfo(vehicle, 'recalls')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Recalls
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fetchVehicleInfo(vehicle, 'safety')}
                >
                  <FileWarning className="h-4 w-4 mr-2" />
                  Safety
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fetchVehicleInfo(vehicle, 'complaints')}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Complaints
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

      <Dialog open={!!selectedVehicle && !!infoType} onOpenChange={() => {
        setSelectedVehicle(null);
        setInfoType(null);
        setVehicleInfo(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {infoType === 'recalls' && 'Recall Information'}
              {infoType === 'safety' && 'Safety Ratings'}
              {infoType === 'complaints' && 'Consumer Complaints'}
              {selectedVehicle && ` - ${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {renderVehicleInfo()}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
};