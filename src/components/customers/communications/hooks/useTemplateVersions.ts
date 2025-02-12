
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { TemplateVersion } from "../types/template-system";

export function useTemplateVersions(templateId: string) {
  const queryClient = useQueryClient();

  const { data: versions = [], isLoading } = useQuery({
    queryKey: ["template-versions", templateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("template_versions")
        .select("*")
        .eq("template_id", templateId)
        .order("version_number", { ascending: false });

      if (error) throw error;
      return data as TemplateVersion[];
    },
    enabled: !!templateId,
  });

  const restoreVersion = useMutation({
    mutationFn: async (version: TemplateVersion) => {
      const { data, error } = await supabase
        .from("email_templates")
        .update({
          content: version.content,
          subject: version.metadata.subject,
          name: version.metadata.name,
          category_id: version.metadata.category_id,
          notification_settings: version.metadata.notification_settings,
        })
        .eq("id", version.template_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      queryClient.invalidateQueries({ queryKey: ["template-versions", templateId] });
      toast.success("Template version restored successfully");
    },
    onError: (error) => {
      console.error("Error restoring template version:", error);
      toast.error("Failed to restore template version");
    },
  });

  return {
    versions,
    isLoading,
    restoreVersion,
  };
}
