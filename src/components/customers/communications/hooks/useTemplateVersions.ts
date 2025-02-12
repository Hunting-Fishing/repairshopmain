
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
        .from("email_template_versions")
        .select(`
          id,
          template_id,
          version_number,
          content,
          subject,
          variables,
          created_at,
          created_by,
          organization_id
        `)
        .eq("template_id", templateId)
        .order("version_number", { ascending: false });

      if (error) throw error;

      // Transform the data to match TemplateVersion interface
      return data.map(version => ({
        ...version,
        metadata: {
          subject: version.subject,
          name: '', // Will be populated from the template if needed
          notification_settings: {} // Default empty settings
        }
      })) as TemplateVersion[];
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
          version_number: version.version_number,
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
