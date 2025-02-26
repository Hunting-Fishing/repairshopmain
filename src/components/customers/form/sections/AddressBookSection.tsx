
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Star, Home, Briefcase, GripVertical } from "lucide-react";
import { CustomerAddressFields } from "../CustomerAddressFields";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { TabErrorState } from "../../loading/TabErrorState";

interface AddressBookSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

const ADDRESS_TYPES = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'work', label: 'Work', icon: Briefcase },
  { value: 'other', label: 'Other', icon: GripVertical }
] as const;

const POSTAL_CODE_REGEX = /^[0-9]{5}(-[0-9]{4})?$/; // Basic US format - enhance for international

export function AddressBookSection({ form, isModernTheme = false }: AddressBookSectionProps) {
  const [isReorderingOpen, setIsReorderingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const addresses = form.watch("address_book") || [];
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: addresses.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      // Dynamic size estimation based on content
      const address = addresses[index];
      const hasError = !POSTAL_CODE_REGEX.test(address.postal_code);
      return hasError ? 320 : 280; // Add extra height for error message
    },
    overscan: 5,
  });

  const addAddress = () => {
    try {
      const currentAddresses = form.getValues("address_book") || [];
      const isPrimary = currentAddresses.length === 0; // First address is primary

      form.setValue("address_book", [
        ...currentAddresses,
        {
          type: "other",
          is_primary: isPrimary,
          street_address: "",
          city: "",
          state_province: "",
          postal_code: "",
          country: ""
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add address'));
      toast.error('Failed to add address');
    }
  };

  const removeAddress = (index: number) => {
    try {
      setIsLoading(true);
      const currentAddresses = form.getValues("address_book") || [];
      const removedAddress = currentAddresses[index];

      const newAddresses = currentAddresses.filter((_, i) => i !== index);

      // If we removed the primary address, make the first remaining address primary
      if (removedAddress.is_primary && newAddresses.length > 0) {
        newAddresses[0].is_primary = true;
      }

      form.setValue("address_book", newAddresses);
      toast.success('Address removed successfully');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove address'));
      toast.error('Failed to remove address');
    } finally {
      setIsLoading(false);
    }
  };

  const setPrimaryAddress = (index: number) => {
    try {
      const currentAddresses = form.getValues("address_book") || [];
      const updatedAddresses = currentAddresses.map((addr, i) => ({
        ...addr,
        is_primary: i === index
      }));
      form.setValue("address_book", updatedAddresses);
      toast.success('Primary address updated');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set primary address'));
      toast.error('Failed to update primary address');
    }
  };

  const updateAddressType = (index: number, type: 'home' | 'work' | 'other') => {
    try {
      const currentAddresses = form.getValues("address_book") || [];
      const updatedAddresses = [...currentAddresses];
      updatedAddresses[index] = { ...updatedAddresses[index], type };
      form.setValue("address_book", updatedAddresses);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update address type'));
      toast.error('Failed to update address type');
    }
  };

  if (error) {
    return <TabErrorState error={error} resetError={() => setError(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Address Book</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsReorderingOpen(true)}
            disabled={addresses.length < 2}
          >
            Reorder Addresses
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAddress}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        </div>
      </div>

      {addresses.length > 0 ? (
        <div 
          ref={parentRef} 
          className="max-h-[600px] overflow-auto"
          style={{
            contain: 'strict',
          }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                className="absolute top-0 left-0 w-full"
                style={{
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="relative border rounded-lg p-4 space-y-4 m-2">
                  <div className="flex items-center justify-between mb-4">
                    <Select
                      value={addresses[virtualItem.index].type}
                      onValueChange={(value: 'home' | 'work' | 'other') => 
                        updateAddressType(virtualItem.index, value)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ADDRESS_TYPES.map(({ value, label, icon: Icon }) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={addresses[virtualItem.index].is_primary}
                        onClick={() => setPrimaryAddress(virtualItem.index)}
                        className={`${
                          addresses[virtualItem.index].is_primary
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
                        onClick={() => removeAddress(virtualItem.index)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CustomerAddressFields
                    form={form}
                    isModernTheme={isModernTheme}
                    addressIndex={virtualItem.index}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No additional addresses. Click "Add Address" to add one.
        </div>
      )}

      <Dialog open={isReorderingOpen} onOpenChange={setIsReorderingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reorder Addresses</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {addresses.map((address, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">
                      {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {address.street_address}
                    </p>
                  </div>
                </div>
                {address.is_primary && (
                  <Star className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
