
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportField } from '../types';
import { Plus, X } from 'lucide-react';

interface FieldSelectorProps {
  fields: ReportField[];
  onFieldsChange: (fields: ReportField[]) => void;
}

export function FieldSelector({ fields, onFieldsChange }: FieldSelectorProps) {
  const addField = () => {
    onFieldsChange([
      ...fields,
      { name: '', label: '', type: 'string' }
    ]);
  };

  const removeField = (index: number) => {
    onFieldsChange(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<ReportField>) => {
    onFieldsChange(
      fields.map((field, i) => 
        i === index ? { ...field, ...updates } : field
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={index} className="flex gap-2 items-start">
            <Input
              placeholder="Field Name"
              value={field.name}
              onChange={(e) => updateField(index, { name: e.target.value })}
              className="flex-1"
            />
            <Input
              placeholder="Display Label"
              value={field.label}
              onChange={(e) => updateField(index, { label: e.target.value })}
              className="flex-1"
            />
            <Select
              value={field.type}
              onValueChange={(value) => updateField(index, { 
                type: value as 'string' | 'number' | 'date' | 'boolean'
              })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="destructive" 
              size="icon"
              onClick={() => removeField(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button onClick={addField} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Field
      </Button>
    </div>
  );
}
