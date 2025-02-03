import { Box, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SupplierFeatures } from "./supplier-card/SupplierFeatures";
import { SupplierStats } from "./supplier-card/SupplierStats";
import { SupplierContact } from "./supplier-card/SupplierContact";
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
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden w-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
            <Box className="h-8 w-8 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{supplier.name}</h3>
                  <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                    {supplier.status}
                  </Badge>
                </div>
                {supplier.contact_person && (
                  <p className="text-sm text-muted-foreground mt-1">{supplier.contact_person}</p>
                )}
              </div>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>

            <SupplierFeatures />
            <SupplierStats />

            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/5">
                  {country}
                </Badge>
                <SupplierContact supplier={supplier} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}