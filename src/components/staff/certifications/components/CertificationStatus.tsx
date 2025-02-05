import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface CertificationStatusProps {
  expiryDate: string | null;
}

export function CertificationStatus({ expiryDate }: CertificationStatusProps) {
  const getStatus = (expiryDate: string | null) => {
    if (!expiryDate) return "No Expiry";
    const expiry = new Date(expiryDate);
    const monthFromNow = new Date();
    monthFromNow.setMonth(monthFromNow.getMonth() + 1);
    
    if (expiry < new Date()) return "Expired";
    if (expiry <= monthFromNow) return "Expiring Soon";
    return "Valid";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Expired":
        return "destructive";
      case "Expiring Soon":
        return "warning";
      case "Valid":
        return "success";
      default:
        return "secondary";
    }
  };

  const status = getStatus(expiryDate);

  return (
    <Badge 
      variant={getStatusBadgeVariant(status)}
      className="flex items-center gap-1"
    >
      {status === "Expiring Soon" && <AlertTriangle className="h-4 w-4" />}
      {status}
    </Badge>
  );
}