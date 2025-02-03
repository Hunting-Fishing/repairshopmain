import { Box, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SupplierFeatures } from "./supplier-card/SupplierFeatures";
import { SupplierStats } from "./supplier-card/SupplierStats";
import { SupplierContact } from "./supplier-card/SupplierContact";
import { SupplierHeader } from "./supplier-card/SupplierHeader";
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
            <SupplierHeader supplier={supplier} country={country} />
            <SupplierFeatures />
            <SupplierStats />
            <SupplierContact supplier={supplier} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}