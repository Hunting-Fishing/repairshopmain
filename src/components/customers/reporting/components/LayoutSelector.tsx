
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { getReportLayouts } from '../services/reportService';

interface LayoutSelectorProps {
  templateId: string;
  value?: string;
  onChange: (layoutId: string) => void;
}

export function LayoutSelector({ templateId, value, onChange }: LayoutSelectorProps) {
  const { data: layouts = [] } = useQuery({
    queryKey: ['report-layouts'],
    queryFn: getReportLayouts
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select layout" />
      </SelectTrigger>
      <SelectContent>
        {layouts.map((layout) => (
          <SelectItem key={layout.id} value={layout.id}>
            {layout.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
