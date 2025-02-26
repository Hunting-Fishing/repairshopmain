
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { CustomerAddressFields } from "../CustomerAddressFields";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

interface AddressBookSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function AddressBookSection({ form, isModernTheme = false }: AddressBookSectionProps) {
  const addresses = form.watch("address_book") || [];
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: addresses.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280, // Estimated height of each address entry
    overscan: 5, // Number of items to render outside of the visible area
  });

  const addAddress = () => {
    const currentAddresses = form.getValues("address_book") || [];
    form.setValue("address_book", [
      ...currentAddresses,
      {
        type: "other",
        street_address: "",
        city: "",
        state_province: "",
        postal_code: "",
        country: ""
      }
    ]);
  };

  const removeAddress = (index: number) => {
    const currentAddresses = form.getValues("address_book") || [];
    form.setValue(
      "address_book",
      currentAddresses.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Address Book</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAddress}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                    onClick={() => removeAddress(virtualItem.index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
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
    </div>
  );
}
