import { Box, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InventorySupplier } from "../../types";

interface SupplierCardProps {
  supplier: InventorySupplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{supplier.name}</CardTitle>
          </div>
          <Badge 
            variant={supplier.status === 'active' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {supplier.status}
          </Badge>
        </div>
        {supplier.contact_person && (
          <CardDescription>Contact: {supplier.contact_person}</CardDescription>
        )}
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
      </CardContent>
    </Card>
  );
}