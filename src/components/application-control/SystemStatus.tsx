
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
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Activity, Server, Database, HardDrive } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface SystemStatusData {
  database: 'connected' | 'disconnected';
  api: 'operational' | 'degraded' | 'down';
  storage: 'available' | 'limited' | 'unavailable';
  metrics: {
    cpu_usage: number;
    memory_usage: number;
    error_rate: number;
    response_time: number;
  };
}

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  status: 'good' | 'warning' | 'critical';
}

const MetricCard = ({ title, value, unit, icon, status }: MetricCardProps) => {
  const statusColors = {
    good: 'text-green-500',
    warning: 'text-yellow-500',
    critical: 'text-red-500'
  };

  return (
    <div className="rounded-lg border p-4 flex items-center space-x-4">
      <div className={cn("p-2 rounded-full", statusColors[status])}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">
          {value}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {unit}
          </span>
        </p>
      </div>
    </div>
  );
};

export function SystemStatus() {
  const { data: status, isLoading, error } = useQuery({
    queryKey: ['system-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configuration')
        .select('status, metrics')
        .single();

      if (error) {
        toast.error('Failed to fetch system status');
        throw error;
      }

      await supabase.rpc('update_system_metrics');
      return data as { status: string; metrics: SystemStatusData };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
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

  const getMetricStatus = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'critical';
    if (value >= thresholds.warning) return 'warning';
    return 'good';
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load system status: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          System Status
        </CardTitle>
        <CardDescription>Real-time system health and performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  <span>Database</span>
                </div>
                <span className={cn("capitalize", getStatusColor(status?.metrics?.database))}>
                  {status?.metrics?.database}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  <span>API</span>
                </div>
                <span className={cn("capitalize", getStatusColor(status?.metrics?.api))}>
                  {status?.metrics?.api}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  <span>Storage</span>
                </div>
                <span className={cn("capitalize", getStatusColor(status?.metrics?.storage))}>
                  {status?.metrics?.storage}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="CPU Usage"
                value={status?.metrics?.cpu_usage || 0}
                unit="%"
                icon={<Activity className="h-5 w-5" />}
                status={getMetricStatus(status?.metrics?.cpu_usage || 0, { warning: 70, critical: 90 })}
              />
              <MetricCard
                title="Memory Usage"
                value={status?.metrics?.memory_usage || 0}
                unit="%"
                icon={<Server className="h-5 w-5" />}
                status={getMetricStatus(status?.metrics?.memory_usage || 0, { warning: 75, critical: 90 })}
              />
              <MetricCard
                title="Error Rate"
                value={status?.metrics?.error_rate || 0}
                unit="%"
                icon={<AlertCircle className="h-5 w-5" />}
                status={getMetricStatus(status?.metrics?.error_rate || 0, { warning: 5, critical: 10 })}
              />
              <MetricCard
                title="Response Time"
                value={status?.metrics?.response_time || 0}
                unit="ms"
                icon={<CheckCircle2 className="h-5 w-5" />}
                status={getMetricStatus(status?.metrics?.response_time || 0, { warning: 500, critical: 1000 })}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
