
import { Users } from "lucide-react";
import { Customer } from "../customer-management/CustomerTable";

interface CustomerGridProps {
  customers: Customer[];
  isModernTheme?: boolean;
}

export function CustomerGrid({ customers, isModernTheme = false }: CustomerGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {customers.map((customer) => (
        <div key={customer.id} className={`${
          isModernTheme
            ? 'bg-white/90 border border-blue-100/50 hover:shadow-md'
            : 'bg-white border border-gray-200 hover:shadow-md'
        } rounded-lg shadow-sm p-4 transition-shadow`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 ${
              isModernTheme
                ? 'bg-blue-50'
                : 'bg-[#FDE1D3]'
            } rounded-full`}>
              <Users className={`h-4 w-4 ${
                isModernTheme ? 'text-blue-500' : 'text-[#F97316]'
              }`} />
            </div>
            <h3 className="font-medium">{customer.first_name} {customer.last_name}</h3>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>{customer.email}</p>
            <p>{customer.phone_number}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
