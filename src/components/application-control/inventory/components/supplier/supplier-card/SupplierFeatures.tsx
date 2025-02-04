import { RefreshCw, FileText, Truck, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  { icon: <RefreshCw className="h-3 w-3" />, label: "INVENTORY SYNC" },
  { icon: <FileText className="h-3 w-3" />, label: "PRODUCT DATA" },
  { icon: <Truck className="h-3 w-3" />, label: "ORDER ROUTING" },
  { icon: <Package className="h-3 w-3" />, label: "TRACKING" },
];

export function SupplierFeatures() {
  return (
    <div className="flex flex-wrap gap-2">
      {features.map((feature, index) => (
        <Badge 
          key={index}
          variant="outline" 
          className="bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors"
        >
          {feature.icon}
          <span className="ml-1 text-xs font-medium">{feature.label}</span>
        </Badge>
      ))}
    </div>
  );
}