
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Filter, X } from "lucide-react";

export interface StaffFilters {
  role?: string;
  status?: string;
  hireDate?: { before?: string; after?: string };
  hasSpecialties?: boolean;
  searchFields?: string[];
}

interface AdvancedFiltersProps {
  filters: StaffFilters;
  onFiltersChange: (filters: StaffFilters) => void;
  availableRoles: string[];
  availableStatuses: string[];
}

export function AdvancedFilters({ 
  filters, 
  onFiltersChange, 
  availableRoles, 
  availableStatuses 
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<StaffFilters>(filters);
  
  const handleReset = () => {
    const resetFilters: StaffFilters = {
      searchFields: filters.searchFields 
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    setIsOpen(false);
  };
  
  const handleApply = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };
  
  const updateFilter = (key: keyof StaffFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const hasActiveFilters = 
    filters.role !== undefined || 
    filters.status !== undefined || 
    filters.hireDate?.before !== undefined || 
    filters.hireDate?.after !== undefined ||
    filters.hasSpecialties !== undefined;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant={hasActiveFilters ? "default" : "outline"} 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
          {hasActiveFilters && (
            <div className="ml-1 rounded-full bg-primary-foreground w-5 h-5 flex items-center justify-center text-xs">
              {Object.keys(filters).filter(k => k !== 'searchFields' && filters[k as keyof StaffFilters] !== undefined).length}
            </div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>
            Filter staff members based on multiple criteria
          </SheetDescription>
        </SheetHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={localFilters.role || ''} 
              onValueChange={(value) => updateFilter('role', value || undefined)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All roles</SelectItem>
                {availableRoles.map(role => (
                  <SelectItem key={role} value={role}>
                    {role.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={localFilters.status || ''} 
              onValueChange={(value) => updateFilter('status', value || undefined)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                {availableStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Hire Date Range</Label>
            <div className="flex items-center gap-2">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="hireDate-after" className="text-xs">From</Label>
                <Input
                  type="date"
                  id="hireDate-after"
                  value={localFilters.hireDate?.after || ''}
                  onChange={(e) => updateFilter('hireDate', {
                    ...localFilters.hireDate,
                    after: e.target.value || undefined
                  })}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="hireDate-before" className="text-xs">To</Label>
                <Input
                  type="date"
                  id="hireDate-before"
                  value={localFilters.hireDate?.before || ''}
                  onChange={(e) => updateFilter('hireDate', {
                    ...localFilters.hireDate,
                    before: e.target.value || undefined
                  })}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                id="hasSpecialties"
                checked={localFilters.hasSpecialties === true}
                onCheckedChange={(checked) => updateFilter('hasSpecialties', checked)}
              />
              <Label htmlFor="hasSpecialties">Has specialties</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Search in</Label>
            <div className="flex flex-wrap gap-2">
              {['name', 'email', 'phone', 'notes'].map(field => (
                <Button
                  key={field}
                  variant={localFilters.searchFields?.includes(field) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const currentFields = localFilters.searchFields || [];
                    const newFields = currentFields.includes(field)
                      ? currentFields.filter(f => f !== field)
                      : [...currentFields, field];
                    updateFilter('searchFields', newFields);
                  }}
                >
                  {field}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <SheetFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={handleReset}>
              <X className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
