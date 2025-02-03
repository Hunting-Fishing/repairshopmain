import { Box, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InventorySupplier } from "../../types";

interface SupplierCardProps {
  supplier: InventorySupplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const country = supplier.address?.toLowerCase().includes('canada') 
    ? 'Canada' 
    : supplier.address?.toLowerCase().includes('usa') || supplier.address?.toLowerCase().includes('united states')
      ? 'USA' 
      : 'International';

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center flex-shrink-0">
            <Box className="h-8 w-8 text-blue-500" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold truncate">{supplier.name}</h3>
                {supplier.contact_person && (
                  <p className="text-sm text-muted-foreground">{supplier.contact_person}</p>
                )}
              </div>
              <Badge 
                variant={supplier.status === 'active' ? 'default' : 'secondary'}
                className="capitalize flex-shrink-0"
              >
                {supplier.status}
              </Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-sm">{country}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact</p>
                <p className="text-sm">{supplier.phone || 'N/A'}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50">
                Inventory Sync
              </Badge>
              <Badge variant="outline" className="bg-blue-50">
                Order Routing
              </Badge>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}