
import { Card, CardContent } from '@/components/ui/card';
import { ReportPreview } from '../../components/ReportPreview';
import type { ReportTemplate } from '../../types';

interface PreviewTabProps {
  template: ReportTemplate | null;
  previewData: any[];
}

export function PreviewTab({ template, previewData }: PreviewTabProps) {
  return (
    <Card>
      <CardContent>
        <ReportPreview template={template} previewData={previewData} />
      </CardContent>
    </Card>
  );
}
