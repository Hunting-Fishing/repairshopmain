
import { CustomerSearchCommand } from "@/components/search/CustomerSearchCommand";

interface WorkOrderFiltersProps {
  onCustomerSelect: (customerId: string | null) => void;
}

export function WorkOrderFilters({ onCustomerSelect }: WorkOrderFiltersProps) {
  return (
    <CustomerSearchCommand 
      onSelect={onCustomerSelect}
      className="max-w-2xl"
    />
  );
}
