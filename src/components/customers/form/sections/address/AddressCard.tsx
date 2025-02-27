
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../../types/customerTypes";
import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";
import { CustomerAddressFields } from "../../CustomerAddressFields";
import { AddressTypeSelector } from "./AddressTypeSelector";

interface AddressCardProps {
  address: CustomerFormValues['address_book'][0];
  index: number;
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
  onRemove: (index: number) => void;
  onSetPrimary: (index: number) => void;
  onTypeChange: (index: number, type: 'home' | 'work' | 'other') => void;
  isLoading?: boolean;
}

export function AddressCard({
  address,
  index,
  form,
  isModernTheme,
  onRemove,
  onSetPrimary,
  onTypeChange,
  isLoading
}: AddressCardProps) {
  return (
    <div className="relative border rounded-lg p-4 space-y-4 m-2">
      <div className="flex items-center justify-between mb-4">
        <AddressTypeSelector
          type={address.type}
          onChange={(type) => onTypeChange(index, type)}
        />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={address.is_primary}
            onClick={() => onSetPrimary(index)}
            className={`${
              address.is_primary
                ? "text-yellow-500"
                : "text-gray-400 hover:text-yellow-500"
            }`}
          >
            <Star className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600"
            onClick={() => onRemove(index)}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CustomerAddressFields
        form={form}
        isModernTheme={isModernTheme}
        addressIndex={index}
      />
    </div>
  );
}
