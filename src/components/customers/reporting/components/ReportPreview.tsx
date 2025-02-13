
import { ChartWidget } from '../widgets/ChartWidget';
import { ReportTemplate } from '../types';

interface ReportPreviewProps {
  template?: ReportTemplate;
  previewData: any[];
}

export function ReportPreview({ template, previewData }: ReportPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Preview</h3>
        {template?.type === 'chart' && (
          <ChartWidget
            widget={{
              id: 'preview',
              type: 'chart',
              title: template.name || 'Preview',
              config: template.config || {
                chartType: 'bar',
                xAxis: 'name',
                yAxis: 'value'
              },
              position: { x: 0, y: 0, w: 12, h: 4 }
            }}
            data={previewData}
          />
        )}
      </div>
    </div>
  );
}
