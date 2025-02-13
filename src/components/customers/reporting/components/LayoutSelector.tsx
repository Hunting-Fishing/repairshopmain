
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { getReportLayouts } from '../services/reportService';

interface LayoutSelectorProps {
  templateId: string;
  value?: string;
  onChange: (layoutId: string) => void;
}

export function LayoutSelector({ templateId, value, onChange }: LayoutSelectorProps) {
  const { data: layouts, isLoading } = useQuery({
    queryKey: ['report-layouts', templateId],
    queryFn: () => getReportLayouts(templateId),
    enabled: !!templateId
  });

  if (isLoading) return null;

  return (
    <div className="space-y-2">
      <Label>Report Layout</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a layout" />
        </SelectTrigger>
        <SelectContent>
          {layouts?.map((layout) => (
            <SelectItem key={layout.id} value={layout.id}>
              {layout.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
