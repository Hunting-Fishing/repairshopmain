import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { InventorySupplier } from "../../../types/supplier";
import { ContactInformation } from "./sections/ContactInformation";
import { BusinessDetails } from "./sections/BusinessDetails";
import { FinancialInformation } from "./sections/FinancialInformation";
import { AdditionalInformation } from "./sections/AdditionalInformation";

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
            <ContactInformation 
              supplier={editedSupplier}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
            <BusinessDetails 
              supplier={editedSupplier}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FinancialInformation 
              supplier={editedSupplier}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
            <AdditionalInformation 
              supplier={editedSupplier}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
