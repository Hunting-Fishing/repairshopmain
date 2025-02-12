
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TemplateEvent {
  id: string;
  template_id: string;
  organization_id: string;
  event_type: 'approval_requested' | 'approved' | 'rejected' | 'changes_requested' | 'version_created';
  performed_by: string;
  performed_at: string;
  metadata: Record<string, any>;
  notes?: string;
  version_number?: number;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function useTemplateEvents(templateId: string) {
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["template-events", templateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("template_events")
        .select(`
          *,
          profiles:performed_by (
            first_name,
            last_name,
            email
          )
        `)
        .eq('template_id', templateId)
        .order('performed_at', { ascending: false });

      if (error) throw error;
      return data as TemplateEvent[];
    },
  });

  const addEvent = useMutation({
    mutationFn: async (event: Omit<TemplateEvent, "id" | "performed_at" | "profiles">) => {
      const { data, error } = await supabase
        .from("template_events")
        .insert(event)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-events", templateId] });
    },
    onError: (error) => {
      console.error("Error adding template event:", error);
      toast.error("Failed to record template event");
    },
  });

  return {
    events,
    isLoading,
    addEvent,
  };
}
