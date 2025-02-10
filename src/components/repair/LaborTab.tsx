
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { LaborForm } from "./labor/LaborForm";
import { LaborList } from "./labor/LaborList";

interface LaborTabProps {
  repairJobId: string;
}

export function LaborTab({ repairJobId }: LaborTabProps) {
  const { data: labor, isLoading } = useQuery({
    queryKey: ['repair-labor', repairJobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('repair_job_labor')
        .select(`
          *,
          technician:technician_id (first_name, last_name)
        `)
        .eq('repair_job_id', repairJobId);

      if (error) throw error;
      return data;
    }
  });

  const { data: technicians } = useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'technician');

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading labor entries...</div>;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Labor Records</h3>
          <LaborForm 
            repairJobId={repairJobId} 
            technicians={technicians}
          />
        </div>
        <LaborList laborEntries={labor} />
      </CardContent>
    </Card>
  );
}
