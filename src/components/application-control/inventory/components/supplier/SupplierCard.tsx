import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, Mail, MapPin, DollarSign, TrendingUp } from "lucide-react";
import type { InventorySupplier } from "../../types";

interface SupplierCardProps {
  supplier: InventorySupplier;
  onClick?: (supplier: InventorySupplier) => void;
}

export function SupplierCard({ supplier, onClick }: SupplierCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(supplier);
    }
  };

  return (
    <Card 
      className="p-6 space-y-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {supplier.name}
          </h3>
          {supplier.contact_person && (
            <p className="text-sm text-muted-foreground">
              Contact: {supplier.contact_person}
            </p>
          )}
        </div>
        <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
          {supplier.status}
        </Badge>
      </div>

      <div className="space-y-2">
        {supplier.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{supplier.email}</span>
          </div>
        )}
        {supplier.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{supplier.phone}</span>
          </div>
        )}
        {supplier.address && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{supplier.address}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              ${supplier.total_spent?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              {supplier.rating || 'N/A'}
            </p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              {supplier.fulfillment_rate ? `${supplier.fulfillment_rate}%` : 'N/A'}
            </p>
            <p className="text-xs text-muted-foreground">Fulfillment Rate</p>
          </div>
        </div>
      </div>
    </Card>
  );
}