
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ReportBuilder } from './ReportBuilder';
import { CustomerDashboard } from './CustomerDashboard';

export function CustomerReports() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <CustomerDashboard />
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Report list and management will be implemented here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder">
          <ReportBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
