
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { ReportField } from '../types';
import { Plus, X } from 'lucide-react';

interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

interface SortConfigProps {
  sortOptions: SortOption[];
  fields: ReportField[];
  onSortOptionsChange: (options: SortOption[]) => void;
}

export function SortConfig({ sortOptions, fields, onSortOptionsChange }: SortConfigProps) {
  const addSortOption = () => {
    onSortOptionsChange([
      ...sortOptions,
      { field: '', direction: 'asc' }
    ]);
  };

  const removeSortOption = (index: number) => {
    onSortOptionsChange(sortOptions.filter((_, i) => i !== index));
  };

  const updateSortOption = (index: number, updates: Partial<SortOption>) => {
    onSortOptionsChange(
      sortOptions.map((option, i) => 
        i === index ? { ...option, ...updates } : option
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {sortOptions.map((option, index) => (
          <div key={index} className="flex gap-2 items-start">
            <Select
              value={option.field}
              onValueChange={(value) => updateSortOption(index, { field: value })}
              className="flex-1"
            >
              <option value="">Select Field</option>
              {fields.map((field) => (
                <option key={field.name} value={field.name}>
                  {field.label || field.name}
                </option>
              ))}
            </Select>
            <Select
              value={option.direction}
              onValueChange={(value) => updateSortOption(index, { 
                direction: value as 'asc' | 'desc'
              })}
              className="w-[150px]"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
            <Button 
              variant="destructive" 
              size="icon"
              onClick={() => removeSortOption(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button onClick={addSortOption} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Sort Option
      </Button>
    </div>
  );
}
