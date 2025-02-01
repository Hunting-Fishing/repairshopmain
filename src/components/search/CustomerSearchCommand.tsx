import { useState, useEffect } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Car, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerSearchCommandProps {
  onSelect: (customerId: string) => void;
  className?: string;
}

export function CustomerSearchCommand({ onSelect, className }: CustomerSearchCommandProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers", searchQuery],
    queryFn: async () => {
      const query = supabase
        .from("customers")
        .select("*")
        .or(
          `first_name.ilike.%${searchQuery}%,` +
          `last_name.ilike.%${searchQuery}%,` +
          `phone_number.ilike.%${searchQuery}%,` +
          `vehicle_make.ilike.%${searchQuery}%,` +
          `vehicle_model.ilike.%${searchQuery}%,` +
          `vehicle_vin.ilike.%${searchQuery}%`
        )
        .order("last_name", { ascending: true });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: searchQuery.length > 0,
  });

  return (
    <Command className={cn("rounded-lg border shadow-md", className)}>
      <CommandInput 
        placeholder="Search customers (name, phone, vehicle...)" 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No customers found.</CommandEmpty>
        <CommandGroup heading="Customers">
          {customers?.map((customer) => (
            <CommandItem
              key={customer.id}
              value={customer.id}
              onSelect={() => onSelect(customer.id)}
              className="flex flex-col items-start gap-1 py-3"
            >
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="font-medium">
                  {customer.first_name} {customer.last_name}
                </span>
              </div>
              {customer.phone_number && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phone_number}</span>
                </div>
              )}
              {(customer.vehicle_make || customer.vehicle_model) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Car className="h-4 w-4" />
                  <span>
                    {customer.vehicle_year} {customer.vehicle_make} {customer.vehicle_model}
                  </span>
                </div>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}