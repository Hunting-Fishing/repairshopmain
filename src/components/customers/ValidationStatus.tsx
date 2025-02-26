
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationStatusProps {
  status: 'success' | 'warning' | 'error' | 'info';
  type: string;
  message: string;
  details?: string[];
}

export function ValidationStatus({ status, type, message, details }: ValidationStatusProps) {
  const iconMap = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info
  };

  const Icon = iconMap[status];

  const statusStyles = {
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
    info: "text-blue-500"
  };

  return (
    <div className="space-y-1">
      <div className={cn("flex items-center gap-1 text-sm", statusStyles[status])}>
        <Icon className="h-4 w-4" />
        <span>
          {type}: {message}
        </span>
      </div>
      {details && details.length > 0 && (
        <ul className={cn("text-xs pl-6 list-disc", statusStyles[status])}>
          {details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
