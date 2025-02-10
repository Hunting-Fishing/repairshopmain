
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { LaborForm } from "./labor/LaborForm";
import { LaborList } from "./labor/LaborList";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { LaborEntry, Technician } from "@/types/labor";

interface LaborTabProps {
  repairJobId: string;
}

export function LaborTab({ repairJobId }: LaborTabProps) {
  const { data: labor, isLoading: isLaborLoading, error: laborError } = useQuery({
    queryKey: ['repair-labor', repairJobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('repair_job_labor')
        .select(`
          *,
          technician:technician_id (first_name, last_name)
        `)
        .eq('repair_job_id', repairJobId);

      if (error) {
        // Log error to our new error_logs table
        await supabase.from('error_logs').insert({
          error_message: error.message,
          error_stack: error.details,
          component_name: 'LaborTab',
        });
        throw error;
      }
      return data as LaborEntry[];
    }
  });

  const { data: technicians, isLoading: isTechniciansLoading, error: techniciansError } = useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'technician');

      if (error) {
        await supabase.from('error_logs').insert({
          error_message: error.message,
          error_stack: error.details,
          component_name: 'LaborTab',
        });
        throw error;
      }
      return data as Technician[];
    }
  });

  if (laborError || techniciansError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {laborError?.message || techniciansError?.message || 'Failed to load labor data'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLaborLoading || isTechniciansLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold" id="labor-records-title">Labor Records</h3>
          <LaborForm 
            repairJobId={repairJobId} 
            technicians={technicians}
          />
        </div>
        <div role="region" aria-labelledby="labor-records-title">
          <LaborList laborEntries={labor} />
        </div>
      </CardContent>
    </Card>
  );
}
