
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ReportType } from '../types';

interface ReportFormProps {
  name: string;
  type: ReportType;
  onNameChange: (name: string) => void;
  onTypeChange: (type: ReportType) => void;
}

export function ReportForm({ name, type, onNameChange, onTypeChange }: ReportFormProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Input
        placeholder="Report Name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <Select
        value={type}
        onValueChange={(value) => onTypeChange(value as ReportType)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select report type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tabular">Tabular Report</SelectItem>
          <SelectItem value="summary">Summary Report</SelectItem>
          <SelectItem value="chart">Chart Report</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
