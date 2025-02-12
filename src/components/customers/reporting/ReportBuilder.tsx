
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ReportTemplate, ReportType } from './types';

export function ReportBuilder() {
  const [activeTab, setActiveTab] = useState<string>('fields');
  const [template, setTemplate] = useState<Partial<ReportTemplate>>({
    type: 'tabular',
    fields: [],
    filters: [],
    sortOptions: []
  });

  const { data: templates } = useQuery({
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
      console.error('Error saving template:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Builder</CardTitle>
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
              {/* Field selection will be implemented here */}
            </TabsContent>

            <TabsContent value="filters">
              {/* Filter configuration will be implemented here */}
            </TabsContent>

            <TabsContent value="sort">
              {/* Sort configuration will be implemented here */}
            </TabsContent>

            <TabsContent value="preview">
              {/* Report preview will be implemented here */}
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
