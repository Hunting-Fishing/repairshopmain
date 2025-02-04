import { Mail, Phone, MapPin, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { InventorySupplier } from "../../../../types";

interface ContactInformationProps {
  supplier: InventorySupplier;
  isEditing: boolean;
  onInputChange: (field: keyof InventorySupplier, value: string) => void;
}

export function ContactInformation({ supplier, isEditing, onInputChange }: ContactInformationProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact Information</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <Input
              value={supplier.contact_person || ''}
              onChange={(e) => onInputChange('contact_person', e.target.value)}
              placeholder="Contact person name"
            />
          ) : (
            <span className="text-sm">{supplier.contact_person}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <Input
              type="email"
              value={supplier.email || ''}
              onChange={(e) => onInputChange('email', e.target.value)}
              placeholder="Email address"
            />
          ) : (
            <span className="text-sm">{supplier.email}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <Input
              value={supplier.phone || ''}
              onChange={(e) => onInputChange('phone', e.target.value)}
              placeholder="Phone number"
            />
          ) : (
            <span className="text-sm">{supplier.phone}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <Input
              value={supplier.address || ''}
              onChange={(e) => onInputChange('address', e.target.value)}
              placeholder="Business address"
            />
          ) : (
            <span className="text-sm">{supplier.address}</span>
          )}
        </div>
      </div>
    </div>
  );
}