
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ReportBuilder } from './ReportBuilder';
import { CustomerDashboard } from './CustomerDashboard';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ReportExport } from './ReportExport';
import { ReportScheduleDialog } from './ReportScheduleDialog';
import { ReportOutputViewer } from './ReportOutputViewer';

export function CustomerReports() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { data: reports, isLoading } = useQuery({
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'archived':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  const handleSchedule = async (schedule: any) => {
    // Implementation will be added when needed
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="outputs">Outputs</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <CustomerDashboard />
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reports</CardTitle>
              <Button onClick={() => setActiveView('builder')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading reports...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports?.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell className="capitalize">{report.type}</TableCell>
                        <TableCell>
                          {format(new Date(report.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusBadgeColor(report.status)}
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ReportExport templateId={report.id} data={[]} />
                            <ReportScheduleDialog
                              templateId={report.id}
                              onSchedule={handleSchedule}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {reports?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No reports found. Create your first report.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder">
          <ReportBuilder />
        </TabsContent>

        <TabsContent value="outputs">
          <ReportOutputViewer templateId={selectedTemplate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
