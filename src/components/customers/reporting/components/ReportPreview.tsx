
import { ChartWidget } from '../widgets/ChartWidget';
import { ReportTemplate } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportPreviewProps {
  template?: ReportTemplate;
  previewData: any[];
}

export function ReportPreview({ template, previewData }: ReportPreviewProps) {
  const formatValue = (value: any, type: string) => {
    if (value == null) return '';
    
    switch (type) {
      case 'number':
        return new Intl.NumberFormat().format(value);
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'percentage':
        return new Intl.NumberFormat('en-US', { style: 'percent' }).format(value / 100);
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return value;
    }
  };

  const renderTabularPreview = () => (
    <Table>
      <TableHeader>
        <TableRow>
          {template?.fields.map((field, index) => (
            <TableHead key={index}>{field.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {previewData.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {template?.fields.map((field, colIndex) => (
              <TableCell key={colIndex}>
                {formatValue(row[field.name], field.type)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderSummaryPreview = () => {
    const summaryData = template?.fields.map(field => {
      let value = 0;
      if (field.aggregate) {
        switch (field.aggregate) {
          case 'sum':
            value = previewData.reduce((sum, row) => sum + (row[field.name] || 0), 0);
            break;
          case 'avg':
            value = previewData.reduce((sum, row) => sum + (row[field.name] || 0), 0) / previewData.length;
            break;
          case 'count':
            value = previewData.length;
            break;
          case 'min':
            value = Math.min(...previewData.map(row => row[field.name] || 0));
            break;
          case 'max':
            value = Math.max(...previewData.map(row => row[field.name] || 0));
            break;
        }
      }
      return { label: field.label, value };
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryData?.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof item.value === 'number' ? 
                  new Intl.NumberFormat().format(item.value) : 
                  item.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderChartPreview = () => (
    <div className="h-[400px]">
      <ChartWidget
        widget={{
          id: 'preview',
          type: 'chart',
          title: template?.name || 'Preview',
          config: template?.config || {
            chartType: 'bar',
            xAxis: 'name',
            yAxis: 'value'
          },
          position: { x: 0, y: 0, w: 12, h: 4 }
        }}
        data={previewData}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Preview</h3>
        {template?.type === 'tabular' && renderTabularPreview()}
        {template?.type === 'summary' && renderSummaryPreview()}
        {template?.type === 'chart' && renderChartPreview()}
      </div>
    </div>
  );
}
