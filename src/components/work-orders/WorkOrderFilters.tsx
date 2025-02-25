
import { CustomerSearchCommand } from "@/components/search/CustomerSearchCommand";

interface WorkOrderFiltersProps {
  onCustomerSelect: (customerId: string | null) => void;
  onDateChange?: (start: Date | undefined, end: Date | undefined) => void;
  onStatusChange?: (status: string) => void;
}

export function WorkOrderFilters({ 
  onCustomerSelect,
  onDateChange,
  onStatusChange 
}: WorkOrderFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <CustomerSearchCommand 
        onSelect={onCustomerSelect}
        className="max-w-2xl"
      />
    </div>
  );
}
