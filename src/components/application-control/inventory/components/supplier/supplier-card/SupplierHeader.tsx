import { Flag, Globe, Box } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InventorySupplier } from "../../../types";

interface SupplierHeaderProps {
  supplier: InventorySupplier;
  country: string;
}

export function SupplierHeader({ supplier, country }: SupplierHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center">
          <Box className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            {getRegionIcon(country)}
            <CardTitle className="text-lg font-semibold">{supplier.name}</CardTitle>
          </div>
          {supplier.contact_person && (
            <CardDescription className="mt-1">{supplier.contact_person}</CardDescription>
          )}
        </div>
      </div>
      <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'} className="capitalize">
        {supplier.status}
      </Badge>
    </div>
  );
}

function getRegionIcon(country: string) {
  switch (country) {
    case 'Canada': return <Flag className="h-5 w-5 text-red-500" />;
    case 'USA': return <Flag className="h-5 w-5 text-blue-500" />;
    default: return <Globe className="h-5 w-5 text-gray-500" />;
  }
}