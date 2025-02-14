
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChartWidget } from '../widgets/ChartWidget';
import { FieldSelector } from '../components/FieldSelector';
import { FilterBuilder } from '../components/FilterBuilder';
import { SortConfig } from '../components/SortConfig';
import { useReportTemplate } from './hooks/useReportTemplate';
import { useReportSave } from './hooks/useReportSave';
import { toast } from 'sonner';
import { ReportHeader } from './components/ReportHeader';
import { ReportForm } from './components/ReportForm';
import type { ReportType } from './types/reportTypes';

export function ReportBuilder() {
  const [activeTab, setActiveTab] = useState<string>('fields');
  const { template, updateTemplate } = useReportTemplate();
  const { saveTemplate, isLoading } = useReportSave();

  const { data: templates, refetch } = useQuery({
    queryKey: ['report-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleSchedule = async (schedule: any) => {
    toast("Report Scheduled", {
      description: "The report has been scheduled successfully"
    });
  };

  // Mock data for preview
  const previewData = [
    { name: 'Jan', value: 100 },
    { name: 'Feb', value: 200 },
    { name: 'Mar', value: 150 },
    { name: 'Apr', value: 300 },
  ];

  return (
    <Card>
      <ReportHeader 
        templateId={template.id} 
        previewData={previewData}
        onSchedule={handleSchedule}
      />
      <CardContent>
        <div className="space-y-6">
          <ReportForm
            name={template.name || ''}
            type={template.type || 'tabular'}
            onNameChange={(name) => updateTemplate({ name })}
            onTypeChange={(type) => updateTemplate({ type: type as ReportType })}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="fields">Fields</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="sort">Sort</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="fields">
              <FieldSelector
                fields={template.fields || []}
                onFieldsChange={(fields) => updateTemplate({ fields })}
              />
            </TabsContent>

            <TabsContent value="filters">
              <FilterBuilder
                filters={template.filters || []}
                fields={template.fields || []}
                onFiltersChange={(filters) => updateTemplate({ filters })}
              />
            </TabsContent>

            <TabsContent value="sort">
              <SortConfig
                sortOptions={template.sortOptions || []}
                fields={template.fields || []}
                onSortOptionsChange={(sortOptions) => updateTemplate({ sortOptions })}
              />
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardContent>
                  {template.type === 'chart' && (
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={() => saveTemplate(template)} disabled={isLoading}>
              Save Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
