
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getProficiencyLabel } from "../utils/proficiencyUtils";
import { Skeleton } from "@/components/ui/skeleton";

interface SkillAssessmentHistoryProps {
  assessmentId: string;
}

export function SkillAssessmentHistory({ assessmentId }: SkillAssessmentHistoryProps) {
  const { data: history, isLoading } = useQuery({
    queryKey: ['skill-assessment-history', assessmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skill_assessment_history')
        .select(`
          *,
          changed_by:profiles(first_name, last_name)
        `)
        .eq('assessment_id', assessmentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <Skeleton className="h-[100px] w-full" />;
  }

  return (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {history?.map((record) => (
          <div key={record.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {record.change_type === 'create' ? 'Assessment Created' : 'Assessment Updated'}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(record.created_at), 'MMM d, yyyy HH:mm')}
              </span>
            </div>
            <div className="text-sm">
              {record.field_name === 'proficiency_level' ? (
                <span>
                  Proficiency changed from{' '}
                  {record.old_value && getProficiencyLabel(parseInt(record.old_value))} to{' '}
                  {getProficiencyLabel(parseInt(record.new_value))}
                </span>
              ) : record.field_name === 'notes' ? (
                <span>Notes updated</span>
              ) : null}
            </div>
            <div className="text-xs text-muted-foreground">
              By {record.changed_by.first_name} {record.changed_by.last_name}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
