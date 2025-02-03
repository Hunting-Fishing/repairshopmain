import { Box, Mail, Phone, MapPin, Globe, Flag, Package, Truck, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InventorySupplier } from "../../types";

interface SupplierCardProps {
  supplier: InventorySupplier;
}

const getCountryFromAddress = (address: string | null) => {
  if (!address) return 'Unknown';
  if (address.toLowerCase().includes('canada')) return 'Canada';
  if (address.toLowerCase().includes('usa') || address.toLowerCase().includes('united states')) return 'USA';
  return 'International';
};

const getRegionIcon = (country: string) => {
  switch (country) {
    case 'Canada':
      return <Flag className="h-5 w-5 text-red-500" />;
    case 'USA':
      return <Flag className="h-5 w-5 text-blue-500" />;
    default:
      return <Globe className="h-5 w-5 text-gray-500" />;
  }
};

const getRegionColor = (country: string) => {
  switch (country) {
    case 'Canada':
      return 'bg-red-50 hover:bg-red-100 border-red-200';
    case 'USA':
      return 'bg-blue-50 hover:bg-blue-100 border-blue-200';
    default:
      return 'bg-gray-50 hover:bg-gray-100 border-gray-200';
  }
};

export function SupplierCard({ supplier }: SupplierCardProps) {
  const country = getCountryFromAddress(supplier.address);
  const regionColor = getRegionColor(country);

  return (
    <Card className={`transition-all duration-200 ${regionColor}`}>
      <CardHeader className="pb-4">
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
          <Badge 
            variant={supplier.status === 'active' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {supplier.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {supplier.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${supplier.email}`} className="hover:underline">
                {supplier.email}
              </a>
            </div>
          )}
          {supplier.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${supplier.phone}`} className="hover:underline">
                {supplier.phone}
              </a>
            </div>
          )}
          {supplier.address && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.address}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="w-full">
              <Package className="h-4 w-4 mr-2" />
              Products
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Truck className="h-4 w-4 mr-2" />
              Orders
            </Button>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ShoppingCart className="h-4 w-4" />
              <span>Products: 0</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span>In Stock: 0</span>
            </div>
          </div>
        </div>

        {supplier.notes && (
          <div className="pt-3 text-sm text-muted-foreground border-t">
            {supplier.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}