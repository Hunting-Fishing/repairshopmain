import { Box, ArrowUpRight, MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Box className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold truncate">{supplier.name}</h3>
                  {supplier.status === 'active' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                {supplier.contact_person && (
                  <p className="text-sm text-muted-foreground">{supplier.contact_person}</p>
                )}
              </div>
              <Badge 
                variant={supplier.status === 'active' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {supplier.status}
              </Badge>
            </div>

            <div className="mt-4 space-y-2">
              {supplier.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{supplier.address}</span>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{supplier.phone}</span>
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{supplier.email}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5">
                  {country}
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  Active Orders: 0
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}