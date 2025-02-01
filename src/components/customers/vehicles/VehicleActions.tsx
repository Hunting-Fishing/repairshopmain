import { Shield, FileWarning, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VehicleActionsProps {
  onInfoRequest: (type: 'recalls' | 'safety' | 'complaints') => void;
  onDeleteClick: () => void;
}

export const VehicleActions = ({ onInfoRequest, onDeleteClick }: VehicleActionsProps) => {
  return (
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
        onClick={onDeleteClick}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};