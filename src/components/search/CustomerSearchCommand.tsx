import { useState } from "react";
import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Car, Phone, User, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerSearchCommandProps {
  onSelect: (customerId: string, vehicleInfo: string) => void;
  className?: string;
}

const searchFields = [
  { key: "first_name", label: "First Name", icon: User },
  { key: "last_name", label: "Last Name", icon: User },
  { key: "phone_number", label: "Phone", icon: Phone },
  { key: "vehicle_vin", label: "VIN", icon: Hash },
  { key: "vehicle_make", label: "Make", icon: Car },
  { key: "vehicle_model", label: "Model", icon: Car },
  { key: "vehicle_year", label: "Year", icon: Car },
];

export function CustomerSearchCommand({ onSelect, className }: CustomerSearchCommandProps) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { data: customers } = useQuery({
    queryKey: ["customers", filters],
    queryFn: async () => {
      let query = supabase.from("customers").select("*").order("last_name");
      Object.entries(filters).forEach(([key, value]) => value && query.ilike(key, `%${value}%`));
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: Object.values(filters).some(value => value.length > 0),
  });

  const handleSelect = (customer: any) => {
    const vehicleInfo = [customer.vehicle_year, customer.vehicle_make, customer.vehicle_model]
      .filter(Boolean)
      .join(" ");
    onSelect(customer.id, vehicleInfo);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchFields.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            <Input
              placeholder={`Search by ${label.toLowerCase()}...`}
              value={filters[key] || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
            />
          </div>
        ))}
      </div>
      <Command className={cn("rounded-lg border shadow-md", className)}>
        <CommandList>
          <CommandEmpty>No customers found.</CommandEmpty>
          <CommandGroup heading="Results">
            {customers?.map((customer) => (
              <CommandItem 
                key={customer.id} 
                value={`${customer.first_name} ${customer.last_name}`}
                onSelect={() => handleSelect(customer)}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {customer.first_name} {customer.last_name}
                  </div>
                  {customer.phone_number && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />{customer.phone_number}
                    </div>
                  )}
                  {customer.vehicle_vin && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Hash className="h-4 w-4" />VIN: {customer.vehicle_vin}
                    </div>
                  )}
                  {(customer.vehicle_make || customer.vehicle_model || customer.vehicle_year) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Car className="h-4 w-4" />
                      {[customer.vehicle_year, customer.vehicle_make, customer.vehicle_model]
                        .filter(Boolean)
                        .join(" ")}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}