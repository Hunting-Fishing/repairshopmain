
import { useQuery } from "@tanstack/react-query";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Customer } from "../types/customerTypes";
import { supabase } from "@/integrations/supabase/client";

interface CustomerSearchProps {
  onSelect: (customer: Customer) => void;
  excludeIds?: string[];
}

export function CustomerSearch({ onSelect, excludeIds = [] }: CustomerSearchProps) {
  const { data: customers } = useQuery({
    queryKey: ["customers-search"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("id, first_name, last_name, email")
        .not("id", "in", `(${excludeIds.join(",")})`);

      if (error) throw error;
      return data as Customer[];
    }
  });

  return (
    <Command className="border rounded-md">
      <CommandInput placeholder="Search customers..." />
      <CommandEmpty>No customers found.</CommandEmpty>
      <CommandGroup className="max-h-64 overflow-auto">
        {customers?.map((customer) => (
          <CommandItem
            key={customer.id}
            value={`${customer.first_name} ${customer.last_name}`}
            onSelect={() => onSelect(customer)}
          >
            <div className="flex flex-col">
              <span>
                {customer.first_name} {customer.last_name}
              </span>
              <span className="text-sm text-muted-foreground">
                {customer.email}
              </span>
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
}
