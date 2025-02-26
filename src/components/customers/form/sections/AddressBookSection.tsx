
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { TabErrorState } from "../../loading/TabErrorState";
import { AddressCard } from "./address/AddressCard";
import { ReorderDialog } from "./address/ReorderDialog";

interface AddressBookSectionProps {
  form: UseFormReturn<CustomerFormValues>;
  isModernTheme?: boolean;
}

export function AddressBookSection({ form, isModernTheme = false }: AddressBookSectionProps) {
  const [isReorderingOpen, setIsReorderingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const addresses = form.watch("address_book") || [];
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: addresses.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280,
    overscan: 5,
  });

  const handleAdd = () => {
    try {
      const currentAddresses = form.getValues("address_book") || [];
      form.setValue("address_book", [
        ...currentAddresses,
        {
          type: "other",
          is_primary: currentAddresses.length === 0,
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

  if (error) {
    return (
      <TabErrorState 
        message="Failed to manage address book. Please try again."
        error={error}
        resetError={() => setError(null)}
      />
    );
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
            onClick={handleAdd}
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
          style={{ contain: 'strict' }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => (
              <div
                key={virtualRow.key}
                ref={virtualizer.measureElement}
                className="absolute top-0 left-0 w-full"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <AddressCard
                  address={addresses[virtualRow.index]}
                  index={virtualRow.index}
                  form={form}
                  isModernTheme={isModernTheme}
                  isLoading={isLoading}
                  onRemove={(index) => {
                    setIsLoading(true);
                    try {
                      const newAddresses = addresses.filter((_, i) => i !== index);
                      if (addresses[index].is_primary && newAddresses.length > 0) {
                        newAddresses[0].is_primary = true;
                      }
                      form.setValue("address_book", newAddresses);
                      toast.success('Address removed successfully');
                    } catch (err) {
                      toast.error('Failed to remove address');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  onSetPrimary={(index) => {
                    const updatedAddresses = addresses.map((addr, i) => ({
                      ...addr,
                      is_primary: i === index
                    }));
                    form.setValue("address_book", updatedAddresses);
                    toast.success('Primary address updated');
                  }}
                  onTypeChange={(index, type) => {
                    const updatedAddresses = [...addresses];
                    updatedAddresses[index] = { ...updatedAddresses[index], type };
                    form.setValue("address_book", updatedAddresses);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No additional addresses. Click "Add Address" to add one.
        </div>
      )}

      <ReorderDialog
        open={isReorderingOpen}
        onOpenChange={setIsReorderingOpen}
        addresses={addresses}
      />
    </div>
  );
}
