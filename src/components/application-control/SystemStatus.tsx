
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SystemStatusData {
  database: 'connected' | 'disconnected';
  api: 'operational' | 'degraded' | 'down';
  storage: 'available' | 'limited' | 'unavailable';
}

export function SystemStatus() {
  const { data: status, isLoading } = useQuery({
    queryKey: ['system-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configuration')
        .select('status, metrics')
        .single();

      if (error) throw error;

      const metrics = data?.metrics as SystemStatusData;
      return metrics || {
        database: 'connected',
        api: 'operational',
        storage: 'available'
      };
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'operational':
      case 'available':
        return 'text-green-500';
      case 'degraded':
      case 'limited':
        return 'text-yellow-500';
      default:
        return 'text-red-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current system health and performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner 
                variant="secondary" 
                size="sm"
                label="Checking system status..."
              />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Database</span>
                <span className={cn("text-sm", getStatusColor(status?.database))}>
                  {status?.database}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">API Services</span>
                <span className={cn("text-sm", getStatusColor(status?.api))}>
                  {status?.api}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Storage</span>
                <span className={cn("text-sm", getStatusColor(status?.storage))}>
                  {status?.storage}
                </span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
