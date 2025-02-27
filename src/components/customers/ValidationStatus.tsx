
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationStatusProps {
  status: 'success' | 'error' | 'warning';
  type: string;
  message: string;
  details?: string[];
}

export function ValidationStatus({ 
  status, 
  type, 
  message, 
  details 
}: ValidationStatusProps) {
  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return '';
    }
  };

  return (
    <div className={cn(
      "mt-2 p-2 rounded-md border text-sm animate-slideDown",
      getStatusColor()
    )}>
      <div className="flex items-start gap-2">
        {getIcon()}
        <div className="flex-1">
          <p className="font-medium">{type} {status}</p>
          <p className="text-sm opacity-90">{message}</p>
          {details && details.length > 0 && (
            <ul className="mt-1 list-disc list-inside text-sm opacity-75">
              {details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
