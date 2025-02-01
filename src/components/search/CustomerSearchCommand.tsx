import { useState, useEffect } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Car, Phone, User, Hash, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerSearchCommandProps {
  onSelect: (customerId: string) => void;
  className?: string;
}

interface SearchFilters {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  vehicleVin: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
}

export function CustomerSearchCommand({ onSelect, className }: CustomerSearchCommandProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    vehicleVin: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
  });

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers", filters],
    queryFn: async () => {
      let query = supabase
        .from("customers")
        .select("*")
        .order("last_name", { ascending: true });

      if (filters.firstName) {
        query = query.ilike("first_name", `%${filters.firstName}%`);
      }
      if (filters.lastName) {
        query = query.ilike("last_name", `%${filters.lastName}%`);
      }
      if (filters.phoneNumber) {
        query = query.ilike("phone_number", `%${filters.phoneNumber}%`);
      }
      if (filters.vehicleVin) {
        query = query.ilike("vehicle_vin", `%${filters.vehicleVin}%`);
      }
      if (filters.vehicleMake) {
        query = query.ilike("vehicle_make", `%${filters.vehicleMake}%`);
      }
      if (filters.vehicleModel) {
        query = query.ilike("vehicle_model", `%${filters.vehicleModel}%`);
      }
      if (filters.vehicleYear) {
        query = query.ilike("vehicle_year", `%${filters.vehicleYear}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: Object.values(filters).some(value => value.length > 0),
  });

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>First Name</Label>
          <Input
            placeholder="Search by first name..."
            value={filters.firstName}
            onChange={(e) => handleFilterChange("firstName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Last Name</Label>
          <Input
            placeholder="Search by last name..."
            value={filters.lastName}
            onChange={(e) => handleFilterChange("lastName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input
            placeholder="Search by phone..."
            value={filters.phoneNumber}
            onChange={(e) => handleFilterChange("phoneNumber", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>VIN</Label>
          <Input
            placeholder="Search by VIN..."
            value={filters.vehicleVin}
            onChange={(e) => handleFilterChange("vehicleVin", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Make</Label>
          <Input
            placeholder="Search by vehicle make..."
            value={filters.vehicleMake}
            onChange={(e) => handleFilterChange("vehicleMake", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Model</Label>
          <Input
            placeholder="Search by vehicle model..."
            value={filters.vehicleModel}
            onChange={(e) => handleFilterChange("vehicleModel", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Year</Label>
          <Input
            placeholder="Search by vehicle year..."
            value={filters.vehicleYear}
            onChange={(e) => handleFilterChange("vehicleYear", e.target.value)}
          />
        </div>
      </div>

      <Command className={cn("rounded-lg border shadow-md", className)}>
        <CommandList>
          <CommandEmpty>No customers found.</CommandEmpty>
          <CommandGroup heading="Results">
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
                {customer.vehicle_vin && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span>VIN: {customer.vehicle_vin}</span>
                  </div>
                )}
                {(customer.vehicle_make || customer.vehicle_model || customer.vehicle_year) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Car className="h-4 w-4" />
                    <span>
                      {[
                        customer.vehicle_year,
                        customer.vehicle_make,
                        customer.vehicle_model,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </span>
                  </div>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}