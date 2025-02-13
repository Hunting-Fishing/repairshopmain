
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

  const getOperatorsByFieldType = (fieldType: string) => {
    const commonOperators = ['equals', 'notEquals', 'isNull', 'isNotNull'];
    
    switch (fieldType) {
      case 'string':
      case 'email':
      case 'url':
        return [...commonOperators, 'contains', 'notContains', 'startsWith', 'endsWith', 'regex'];
      case 'number':
      case 'currency':
      case 'percentage':
        return [...commonOperators, 'gt', 'lt', 'gte', 'lte', 'between'];
      case 'date':
        return [...commonOperators, 'gt', 'lt', 'gte', 'lte', 'between'];
      case 'boolean':
        return ['equals', 'notEquals'];
      case 'phone':
        return [...commonOperators, 'contains', 'startsWith'];
      default:
        return commonOperators;
    }
  };

  const getOperatorLabel = (operator: string) => {
    const labels: Record<string, string> = {
      equals: 'Equals',
      notEquals: 'Not Equals',
      contains: 'Contains',
      notContains: 'Does Not Contain',
      gt: 'Greater Than',
      lt: 'Less Than',
      gte: 'Greater Than or Equal',
      lte: 'Less Than or Equal',
      between: 'Between',
      in: 'In',
      startsWith: 'Starts With',
      endsWith: 'Ends With',
      isNull: 'Is Empty',
      isNotNull: 'Is Not Empty',
      regex: 'Matches Pattern'
    };
    return labels[operator] || operator;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {filters.map((filter, index) => {
          const selectedField = fields.find(f => f.name === filter.field);
          const operators = selectedField ? getOperatorsByFieldType(selectedField.type) : [];
          
          return (
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
                  operator: value as ReportFilter['operator']
                })}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((operator) => (
                    <SelectItem key={operator} value={operator}>
                      {getOperatorLabel(operator)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {!['isNull', 'isNotNull'].includes(filter.operator) && (
                <Input
                  placeholder="Value"
                  value={filter.value}
                  onChange={(e) => updateFilter(index, { value: e.target.value })}
                  className="flex-1"
                  type={selectedField?.type === 'number' ? 'number' : 'text'}
                />
              )}

              <Button 
                variant="destructive" 
                size="icon"
                onClick={() => removeFilter(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
      <Button onClick={addFilter} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Filter
      </Button>
    </div>
  );
}
