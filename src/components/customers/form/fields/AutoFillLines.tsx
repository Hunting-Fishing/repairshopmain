
import { useState } from 'react';
import { PlusCircle, Trash2, AlertCircle } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";
import { CustomerFormValues } from "../../types/customerTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

interface AutoFillLine {
  id: number;
  field: string;
  value: string;
}

interface AutoFillLinesProps {
  form: UseFormReturn<CustomerFormValues>;
  onApply: (lines: AutoFillLine[]) => void;
}

export function AutoFillLines({ form, onApply }: AutoFillLinesProps) {
  const [lines, setLines] = useState<AutoFillLine[]>([{ id: 1, field: '', value: '' }]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const { toast } = useToast();

  const addLine = () => {
    const newId = Math.max(...lines.map(line => line.id), 0) + 1;
    setLines([...lines, { id: newId, field: '', value: '' }]);
  };

  const removeLine = (id: number) => {
    if (lines.length > 1) {
      setLines(lines.filter(line => line.id !== id));
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
    } else {
      toast({
        title: "Cannot Remove Line",
        description: "At least one line is required",
        variant: "destructive",
      });
    }
  };

  const updateLine = (id: number, field: 'field' | 'value', newValue: string) => {
    setLines(lines.map(line => 
      line.id === id ? { ...line, [field]: newValue } : line
    ));
    
    // Clear error when user starts typing
    if (errors[id]) {
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
    }
  };

  const validateLines = (): boolean => {
    const newErrors: Record<number, string> = {};
    let isValid = true;

    lines.forEach(line => {
      if (!line.field.trim() || !line.value.trim()) {
        newErrors[line.id] = 'Both field and value are required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleApply = () => {
    if (validateLines()) {
      onApply(lines);
      toast({
        title: "Fields Applied",
        description: "The form has been updated with the provided values",
      });
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200">
      <div className="space-y-4">
        {lines.map((line) => (
          <div key={line.id} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Field name"
                value={line.field}
                onChange={(e) => updateLine(line.id, 'field', e.target.value)}
                className={errors[line.id] ? 'border-red-500' : ''}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Value"
                value={line.value}
                onChange={(e) => updateLine(line.id, 'value', e.target.value)}
                className={errors[line.id] ? 'border-red-500' : ''}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeLine(line.id)}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {errors[line.id] && (
              <div className="flex items-center text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors[line.id]}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={addLine}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Line
        </Button>
        <Button
          type="button"
          onClick={handleApply}
          className="w-full sm:w-auto"
        >
          Apply Values
        </Button>
      </div>
    </div>
  );
}
