
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { TemplateTag, TemplateTagAssignment } from "../types/template-system";

export function useTemplateTags() {
  const queryClient = useQueryClient();

  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["template-tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("template_tags")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as TemplateTag[];
    },
  });

  const createTag = useMutation({
    mutationFn: async (tag: Omit<TemplateTag, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("template_tags")
        .insert(tag)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-tags"] });
      toast.success("Tag created successfully");
    },
    onError: (error) => {
      console.error("Error creating tag:", error);
      toast.error("Failed to create tag");
    },
  });

  const assignTag = useMutation({
    mutationFn: async ({ templateId, tagId }: { templateId: string; tagId: string }) => {
      const { error } = await supabase
        .from("template_tag_assignments")
        .insert({ template_id: templateId, tag_id: tagId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-tags"] });
      toast.success("Tag assigned successfully");
    },
    onError: (error) => {
      console.error("Error assigning tag:", error);
      toast.error("Failed to assign tag");
    },
  });

  const removeTag = useMutation({
    mutationFn: async ({ templateId, tagId }: { templateId: string; tagId: string }) => {
      const { error } = await supabase
        .from("template_tag_assignments")
        .delete()
        .eq("template_id", templateId)
        .eq("tag_id", tagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-tags"] });
      toast.success("Tag removed successfully");
    },
    onError: (error) => {
      console.error("Error removing tag:", error);
      toast.error("Failed to remove tag");
    },
  });

  return {
    tags,
    isLoading,
    createTag,
    assignTag,
    removeTag,
  };
}
