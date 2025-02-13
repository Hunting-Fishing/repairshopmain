
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportFilter, ReportField } from '../types';
import { Plus, X } from 'lucide-react';

interface FilterBuilderProps {
  filters: ReportFilter[];
  fields: ReportField[];
  onFiltersChange: (filters: ReportFilter[]) => void;
}

export function FilterBuilder({ filters, fields, onFiltersChange }: FilterBuilderProps) {
  const addFilter = () => {
    onFiltersChange([
      ...filters,
      { field: '', operator: 'equals', value: '' }
    ]);
  };

  const removeFilter = (index: number) => {
    onFiltersChange(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, updates: Partial<ReportFilter>) => {
    onFiltersChange(
      filters.map((filter, i) => 
        i === index ? { ...filter, ...updates } : filter
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {filters.map((filter, index) => (
          <div key={index} className="flex gap-2 items-start">
            <Select
              value={filter.field}
              onValueChange={(value) => updateFilter(index, { field: value })}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field.name} value={field.name}>
                    {field.label || field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filter.operator}
              onValueChange={(value) => updateFilter(index, { 
                operator: value as 'equals' | 'contains' | 'gt' | 'lt' | 'between' | 'in'
              })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="gt">Greater Than</SelectItem>
                <SelectItem value="lt">Less Than</SelectItem>
                <SelectItem value="between">Between</SelectItem>
                <SelectItem value="in">In</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Value"
              value={filter.value}
              onChange={(e) => updateFilter(index, { value: e.target.value })}
              className="flex-1"
            />
            <Button 
              variant="destructive" 
              size="icon"
              onClick={() => removeFilter(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button onClick={addFilter} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Filter
      </Button>
    </div>
  );
}
