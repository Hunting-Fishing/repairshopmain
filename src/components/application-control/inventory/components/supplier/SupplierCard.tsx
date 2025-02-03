import { Box } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SupplierHeader } from "./supplier-card/SupplierHeader";
import { SupplierContact } from "./supplier-card/SupplierContact";
import { SupplierActions } from "./supplier-card/SupplierActions";
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
    <Card className={`transition-all duration-200 ${getRegionColor(country)}`}>
      <CardHeader className="pb-4">
        <SupplierHeader supplier={supplier} country={country} />
      </CardHeader>
      <CardContent className="space-y-4">
        <SupplierContact supplier={supplier} />
        <SupplierActions supplier={supplier} />
      </CardContent>
    </Card>
  );
}

function getRegionColor(country: string) {
  const colors = {
    Canada: 'bg-red-50 hover:bg-red-100 border-red-200',
    USA: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    International: 'bg-gray-50 hover:bg-gray-100 border-gray-200'
  };
  return colors[country as keyof typeof colors];
}