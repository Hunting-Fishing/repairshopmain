import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ReportTemplate, ReportType } from './types';
import { ChartWidget } from './widgets/ChartWidget';
import { ReportScheduleDialog } from './ReportScheduleDialog';
import { ReportExport } from './ReportExport';
import { useToast } from '@/hooks/use-toast';
import { FieldSelector } from './components/FieldSelector';
import { FilterBuilder } from './components/FilterBuilder';
import { SortConfig } from './components/SortConfig';
import { LayoutSelector } from './components/LayoutSelector';
import { ReportGenerateButton } from './components/ReportGenerateButton';

export function ReportBuilder() {
  const [activeTab, setActiveTab] = useState<string>('fields');
  const [template, setTemplate] = useState<Partial<ReportTemplate>>({
    type: 'tabular',
    fields: [],
    filters: [],
    sortOptions: []
  });

  const { toast } = useToast();

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

  const handleSave = async () => {
    const { error } = await supabase
      .from('report_templates')
      .insert({
        ...template,
        created_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) {
      toast({
        title: "Error Saving Template",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Template Saved",
        description: "Report template has been saved successfully",
      });
      refetch();
    }
  };

  const handleSchedule = async (schedule: any) => {
    toast({
      title: "Report Scheduled",
      description: "The report has been scheduled successfully",
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Report Builder</CardTitle>
        <div className="flex items-center gap-2">
          <ReportExport templateId={template.id || ''} data={previewData} />
          <ReportScheduleDialog templateId={template.id || ''} onSchedule={handleSchedule} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Report Name"
              value={template.name || ''}
              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
            />
            <Select
              value={template.type}
              onValueChange={(value) => setTemplate({ ...template, type: value as ReportType })}
            >
              <option value="tabular">Tabular Report</option>
              <option value="summary">Summary Report</option>
              <option value="chart">Chart Report</option>
            </Select>
          </div>

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
                onFieldsChange={(fields) => setTemplate({ ...template, fields })}
              />
            </TabsContent>

            <TabsContent value="filters">
              <FilterBuilder
                filters={template.filters || []}
                fields={template.fields || []}
                onFiltersChange={(filters) => setTemplate({ ...template, filters })}
              />
            </TabsContent>

            <TabsContent value="sort">
              <SortConfig
                sortOptions={template.sortOptions || []}
                fields={template.fields || []}
                onSortOptionsChange={(sortOptions) => setTemplate({ ...template, sortOptions })}
              />
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Preview & Generate</CardTitle>
                  <div className="flex gap-2">
                    <LayoutSelector
                      templateId={template.id || ''}
                      value={template.layout_id}
                      onChange={(layoutId) => setTemplate({ ...template, layout_id: layoutId })}
                    />
                    {template.id && (
                      <ReportGenerateButton
                        templateId={template.id}
                        parameters={{
                          fields: template.fields,
                          filters: template.filters,
                          sortOptions: template.sortOptions
                        }}
                        onComplete={(outputUrl) => {
                          // Handle the generated report
                          window.open(outputUrl, '_blank');
                        }}
                      />
                    )}
                  </div>
                </CardHeader>
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
            <Button onClick={handleSave}>Save Report</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
