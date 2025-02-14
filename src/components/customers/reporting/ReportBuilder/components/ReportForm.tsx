
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ReportType } from '../types/reportTypes';

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
        value={name || ''}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <Select
        value={type}
        onValueChange={(value) => onTypeChange(value as ReportType)}
      >
        <option value="tabular">Tabular Report</option>
        <option value="summary">Summary Report</option>
        <option value="chart">Chart Report</option>
      </Select>
    </div>
  );
}
