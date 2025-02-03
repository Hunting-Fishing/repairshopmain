import { Box, Mail, Phone, MapPin, Globe, Flag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      return 'bg-red-50 hover:bg-red-100';
    case 'USA':
      return 'bg-blue-50 hover:bg-blue-100';
    default:
      return 'bg-gray-50 hover:bg-gray-100';
  }
};

export function SupplierCard({ supplier }: SupplierCardProps) {
  const country = getCountryFromAddress(supplier.address);
  const regionColor = getRegionColor(country);

  return (
    <Card className={`transition-all duration-200 ${regionColor}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">{supplier.name}</CardTitle>
              {supplier.contact_person && (
                <CardDescription>{supplier.contact_person}</CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getRegionIcon(country)}
            <Badge 
              variant={supplier.status === 'active' ? 'default' : 'secondary'}
              className="capitalize"
            >
              {supplier.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
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
        {supplier.notes && (
          <div className="mt-4 text-sm text-muted-foreground">
            {supplier.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}