
import { Select } from '@/components/ui/select';
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
    <Select
      value={value}
      onValueChange={onChange}
    >
      {layouts.map((layout) => (
        <Select.Option key={layout.id} value={layout.id}>
          {layout.name}
        </Select.Option>
      ))}
    </Select>
  );
}
