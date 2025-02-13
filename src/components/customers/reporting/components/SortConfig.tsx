
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
              value={option.direction}
              onValueChange={(value) => updateSortOption(index, { 
                direction: value as 'asc' | 'desc'
              })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
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
