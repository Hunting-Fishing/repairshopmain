import { Box, ArrowUpRight, MapPin, Phone, Mail, RefreshCw, FileText, Truck, Package } from "lucide-react";
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

  const features = [
    { icon: <RefreshCw className="h-4 w-4" />, label: "INVENTORY SYNC" },
    { icon: <FileText className="h-4 w-4" />, label: "PRODUCT DATA UPLOAD" },
    { icon: <Truck className="h-4 w-4" />, label: "ORDER ROUTING" },
    { icon: <Package className="h-4 w-4" />, label: "SHIPMENT TRACKING" },
  ];

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

            <div className="flex flex-wrap gap-3 mb-4">
              {features.map((feature, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors"
                >
                  {feature.icon}
                  <span className="ml-1 text-xs">{feature.label}</span>
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div>
                <div className="text-sm font-medium">Products</div>
                <div className="mt-1 text-2xl font-bold">
                  {Math.floor(Math.random() * 100000)}
                </div>
                <div className="text-xs text-muted-foreground">Total Products</div>
              </div>
              <div>
                <div className="text-sm font-medium">With UPC</div>
                <div className="mt-1 text-2xl font-bold">
                  {Math.floor(Math.random() * 50000)}
                </div>
                <div className="text-xs text-muted-foreground">Products w/ UPC</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/5">
                  {country}
                </Badge>
                {supplier.email && (
                  <Badge variant="outline" className="bg-primary/5">
                    <Mail className="h-3 w-3 mr-1" />
                    {supplier.email}
                  </Badge>
                )}
                {supplier.phone && (
                  <Badge variant="outline" className="bg-primary/5">
                    <Phone className="h-3 w-3 mr-1" />
                    {supplier.phone}
                  </Badge>
                )}
                {supplier.address && (
                  <Badge variant="outline" className="bg-primary/5">
                    <MapPin className="h-3 w-3 mr-1" />
                    {supplier.address}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}