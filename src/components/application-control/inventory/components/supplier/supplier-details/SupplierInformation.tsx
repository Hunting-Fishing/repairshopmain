import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, User, Building, CreditCard, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { InventorySupplier } from "../../../types";
import { formatDate } from "@/lib/utils";

interface SupplierInformationProps {
  supplier: InventorySupplier;
}

export function SupplierInformation({ supplier }: SupplierInformationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSupplier, setEditedSupplier] = useState(supplier);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof InventorySupplier, value: string | number) => {
    setEditedSupplier(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('inventory_suppliers')
        .update(editedSupplier)
        .eq('id', supplier.id);

      if (error) throw error;

      toast.success("Supplier information updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error("Failed to update supplier information");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {isEditing ? (
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setEditedSupplier(supplier);
                setIsEditing(false);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
            >
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            Edit Information
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={editedSupplier.contact_person || ''}
                      onChange={(e) => handleInputChange('contact_person', e.target.value)}
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
                      value={editedSupplier.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                      value={editedSupplier.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
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
                      value={editedSupplier.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Business address"
                    />
                  ) : (
                    <span className="text-sm">{supplier.address}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={editedSupplier.tax_id || ''}
                      onChange={(e) => handleInputChange('tax_id', e.target.value)}
                      placeholder="Tax ID"
                    />
                  ) : (
                    <span className="text-sm">Tax ID: {supplier.tax_id}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={editedSupplier.payment_method || ''}
                      onChange={(e) => handleInputChange('payment_method', e.target.value)}
                      placeholder="Payment method"
                    />
                  ) : (
                    <span className="text-sm">Payment Method: {supplier.payment_method}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={supplier.status === 'active' ? "default" : "destructive"}>
                    {supplier.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Financial Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Credit Limit:</span>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedSupplier.credit_limit || 0}
                      onChange={(e) => handleInputChange('credit_limit', parseFloat(e.target.value))}
                      className="w-32"
                    />
                  ) : (
                    <span className="text-sm">${supplier.credit_limit?.toFixed(2) || '0.00'}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Spent:</span>
                  <span className="text-sm">${supplier.total_spent?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Currency:</span>
                  {isEditing ? (
                    <Input
                      value={editedSupplier.currency || 'USD'}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-32"
                    />
                  ) : (
                    <span className="text-sm">{supplier.currency || 'USD'}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reliability Score:</span>
                  <span className="text-sm">{supplier.reliability_score?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fulfillment Rate:</span>
                  <span className="text-sm">{supplier.fulfillment_rate?.toFixed(1)}%</span>
                </div>
                {supplier.last_order_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Order:</span>
                    <span className="text-sm">{formatDate(supplier.last_order_date)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {supplier.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              {isEditing ? (
                <Input
                  value={editedSupplier.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add notes"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{supplier.notes}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}