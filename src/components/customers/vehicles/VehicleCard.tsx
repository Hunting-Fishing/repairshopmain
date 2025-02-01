import { Car, Shield, FileWarning, Info, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vehicle } from "./types";
import { VehicleDetails } from "./VehicleDetails";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface VehicleCardProps {
  vehicle: Vehicle;
  onInfoRequest: (type: 'recalls' | 'safety' | 'complaints') => void;
  onVehicleRemoved?: () => void;
}

export const VehicleCard = ({ vehicle, onInfoRequest, onVehicleRemoved }: VehicleCardProps) => {
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

  return (
    <>
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className="border rounded-lg p-4 space-y-4 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-2">
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
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this vehicle? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};