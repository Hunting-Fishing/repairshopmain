
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Check, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SystemStatusCardProps {
  isModernTheme?: boolean;
}

export function SystemStatusCard({ isModernTheme = false }: SystemStatusCardProps) {
  const { data: systemStatus, isLoading } = useQuery({
    queryKey: ['system-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_configuration')
        .select('status, last_check')
        .maybeSingle();

      if (error) {
        toast.error('Failed to fetch system status');
        throw error;
      }

      // If no data exists, insert a default record
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('system_configuration')
          .insert({ status: 'healthy' })
          .select()
          .single();

        if (insertError) {
          toast.error('Failed to initialize system status');
          throw insertError;
        }

        return newData;
      }

      return data;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const getStatusIcon = () => {
    if (isLoading) return <Activity className="h-4 w-4 animate-spin" />;
    return systemStatus?.status === 'healthy' 
      ? <Check className="h-4 w-4 text-green-500" />
      : <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const cardClass = isModernTheme
    ? 'bg-gradient-to-br from-white via-blue-50 to-blue-100/30 shadow-lg border border-blue-200/50'
    : '';

  return (
    <Card className={cn("", cardClass)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          System Status
        </CardTitle>
        {getStatusIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {isLoading ? (
            "Checking system status..."
          ) : systemStatus?.status === 'healthy' ? (
            "All systems operational"
          ) : (
            "Some systems require attention"
          )}
        </div>
        {systemStatus?.last_check && (
          <div className="text-xs text-muted-foreground mt-2">
            Last checked: {new Date(systemStatus.last_check).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
