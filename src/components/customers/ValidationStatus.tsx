
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, AlertCircle, Clock } from "lucide-react";

interface ValidationStatusProps {
  status: 'pending' | 'valid' | 'invalid';
  type: string;
  message?: string;
}

export function ValidationStatus({ status, type, message }: ValidationStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'invalid':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'valid':
        return <Check className="h-3 w-3" />;
      case 'invalid':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="secondary" className={`${getStatusColor()} flex items-center gap-1`}>
            {getStatusIcon()}
            {type}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message || `${type} validation ${status}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
