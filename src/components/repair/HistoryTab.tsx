
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface HistoryEntry {
  id: string;
  change_type: string;
  old_status: string | null;
  new_status: string | null;
  notes: string | null;
  created_at: string;
  changed_by: {
    first_name: string;
    last_name: string;
  };
}

interface HistoryTabProps {
  repairJobId: string;
}

export function HistoryTab({ repairJobId }: HistoryTabProps) {
  const { data: history, isLoading } = useQuery({
    queryKey: ['repair-history', repairJobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('repair_job_history')
        .select(`
          *,
          changed_by:changed_by (first_name, last_name)
        `)
        .eq('repair_job_id', repairJobId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as HistoryEntry[];
    }
  });

  if (isLoading) {
    return <div>Loading history...</div>;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {history?.length === 0 ? (
            <p className="text-center text-muted-foreground">No history entries yet</p>
          ) : (
            history?.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start space-x-4 border-b border-border pb-4 last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {entry.changed_by.first_name} {entry.changed_by.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(entry.created_at), 'PPp')}
                  </p>
                  {entry.old_status && entry.new_status && (
                    <p className="mt-1">
                      Changed status from <span className="font-medium">{entry.old_status}</span> to{" "}
                      <span className="font-medium">{entry.new_status}</span>
                    </p>
                  )}
                  {entry.notes && (
                    <p className="mt-1 text-sm">{entry.notes}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
