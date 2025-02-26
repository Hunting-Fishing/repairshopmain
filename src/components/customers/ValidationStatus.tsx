
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationStatusProps {
  status: 'success' | 'warning' | 'error' | 'info';
  type: string;
  message: string;
}

export function ValidationStatus({ status, type, message }: ValidationStatusProps) {
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
    <div className={cn("flex items-center gap-1 text-sm", statusStyles[status])}>
      <Icon className="h-4 w-4" />
      <span>
        {type}: {message}
      </span>
    </div>
  );
}
