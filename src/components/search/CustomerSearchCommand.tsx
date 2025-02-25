import { useState } from "react";
import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Car, Phone, User, Hash, Wrench, Calendar, SearchX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomerVehicleDialog } from "@/components/customers/vehicles/CustomerVehicleDialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'quoted':
      return 'bg-blue-500';
    case 'approved':
      return 'bg-yellow-500';
    case 'in_progress':
      return 'bg-orange-500';
    case 'completed':
      return 'bg-green-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export function CustomerSearchCommand({ onSelect, className }: CustomerSearchCommandProps) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const { data: customers, isLoading, isFetching } = useQuery({
    queryKey: ["customers", filters],
    queryFn: async () => {
      let query = supabase
        .from("customers")
        .select(`
          *,
          vehicles (
            id,
            make,
            model,
            year,
            vin
          ),
          customer_repair_jobs (
            id,
            description,
            status,
            created_at,
            vehicle_id
          )
        `)
        .order("last_name");

      Object.entries(filters).forEach(([key, value]) => value && query.ilike(key, `%${value}%`));
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: Object.values(filters).some(value => value.length > 0),
  });

  const hasActiveSearch = Object.values(filters).some(value => value.length > 0);

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
          {isLoading || isFetching ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              ))}
            </div>
          ) : !hasActiveSearch ? (
            <div className="p-8 text-center text-muted-foreground">
              <SearchX className="mx-auto h-8 w-8 mb-4" />
              <p>Enter search criteria to find customers</p>
            </div>
          ) : customers?.length === 0 ? (
            <CommandEmpty>No customers found.</CommandEmpty>
          ) : (
            <CommandGroup heading="Results">
              {customers?.map((customer) => (
                <CommandItem 
                  key={customer.id} 
                  value={`${customer.first_name} ${customer.last_name}`}
                  onSelect={() => setSelectedCustomerId(customer.id)}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground block p-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{customer.first_name} {customer.last_name}</span>
                      </div>
                      {customer.phone_number && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {customer.phone_number}
                        </div>
                      )}
                    </div>

                    {customer.vehicles && customer.vehicles.length > 0 && (
                      <div className="pl-4 border-l-2 border-muted space-y-2">
                        {customer.vehicles.map((vehicle) => (
                          <div 
                            key={vehicle.id}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:bg-accent/50 p-2 rounded"
                          >
                            <Car className="h-4 w-4" />
                            <span>
                              {[vehicle.year, vehicle.make, vehicle.model]
                                .filter(Boolean)
                                .join(" ")}
                            </span>
                            {vehicle.vin && (
                              <span className="text-xs">
                                (VIN: {vehicle.vin})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {customer.customer_repair_jobs && customer.customer_repair_jobs.length > 0 && (
                      <div className="pl-4 border-l-2 border-muted space-y-2">
                        {customer.customer_repair_jobs.map((job) => (
                          <div 
                            key={job.id}
                            className="flex items-center justify-between hover:bg-accent/50 p-2 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <Wrench className="h-4 w-4" />
                              <span className="text-sm line-clamp-1">{job.description}</span>
                            </div>
                            <Badge className={cn("text-xs", getStatusColor(job.status))}>
                              {job.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>

      <CustomerVehicleDialog
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        onSelect={onSelect}
      />
    </div>
  );
}
