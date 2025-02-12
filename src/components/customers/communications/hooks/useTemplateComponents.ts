
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { TemplateComponent } from "../types/template-system";

export function useTemplateComponents() {
  const queryClient = useQueryClient();

  const { data: components = [], isLoading } = useQuery({
    queryKey: ["template-components"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("template_components")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as TemplateComponent[];
    },
  });

  const createComponent = useMutation({
    mutationFn: async (component: Omit<TemplateComponent, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("template_components")
        .insert(component)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-components"] });
      toast.success("Component created successfully");
    },
    onError: (error) => {
      console.error("Error creating component:", error);
      toast.error("Failed to create component");
    },
  });

  const updateComponent = useMutation({
    mutationFn: async (component: Partial<TemplateComponent> & { id: string }) => {
      const { data, error } = await supabase
        .from("template_components")
        .update(component)
        .eq("id", component.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-components"] });
      toast.success("Component updated successfully");
    },
    onError: (error) => {
      console.error("Error updating component:", error);
      toast.error("Failed to update component");
    },
  });

  return {
    components,
    isLoading,
    createComponent,
    updateComponent,
  };
}
