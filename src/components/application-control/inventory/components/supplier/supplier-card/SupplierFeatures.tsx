import { RefreshCw, FileText, Truck, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SupplierFeatures() {
  const features = [
    { icon: <RefreshCw className="h-4 w-4" />, label: "INVENTORY SYNC" },
    { icon: <FileText className="h-4 w-4" />, label: "PRODUCT DATA UPLOAD" },
    { icon: <Truck className="h-4 w-4" />, label: "ORDER ROUTING" },
    { icon: <Package className="h-4 w-4" />, label: "SHIPMENT TRACKING" },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {features.map((feature, index) => (
        <Badge 
          key={index}
          variant="outline" 
          className="bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors"
        >
          {feature.icon}
          <span className="ml-1 text-xs">{feature.label}</span>
        </Badge>
      ))}
    </div>
  );
}