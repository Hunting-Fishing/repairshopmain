
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TemplateApprover {
  id: string;
  user_id: string;
  organization_id: string;
  can_approve_all: boolean;
  category_ids: string[];
  allowed_approval_levels: string[];
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function useTemplateApprovers() {
  const queryClient = useQueryClient();

  const { data: approvers = [], isLoading } = useQuery({
    queryKey: ["template-approvers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("template_approvers")
        .select(`
          id,
          user_id,
          organization_id,
          can_approve_all,
          category_ids,
          allowed_approval_levels,
          created_at,
          updated_at,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `);

      if (error) throw error;
      
      // Transform the data to match our interface
      return (data || []).map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        organization_id: item.organization_id,
        can_approve_all: Boolean(item.can_approve_all),
        category_ids: Array.isArray(item.category_ids) ? item.category_ids : [],
        allowed_approval_levels: Array.isArray(item.allowed_approval_levels) ? item.allowed_approval_levels : [],
        created_at: item.created_at,
        updated_at: item.updated_at,
        profiles: item.profiles ? {
          first_name: String(item.profiles.first_name || ''),
          last_name: String(item.profiles.last_name || ''),
          email: String(item.profiles.email || '')
        } : undefined
      })) as TemplateApprover[];
    },
  });

  const addApprover = useMutation({
    mutationFn: async (approver: Omit<TemplateApprover, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("template_approvers")
        .insert(approver)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-approvers"] });
      toast.success("Approver added successfully");
    },
    onError: (error) => {
      console.error("Error adding approver:", error);
      toast.error("Failed to add approver");
    },
  });

  const removeApprover = useMutation({
    mutationFn: async (approverId: string) => {
      const { error } = await supabase
        .from("template_approvers")
        .delete()
        .eq("id", approverId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-approvers"] });
      toast.success("Approver removed successfully");
    },
    onError: (error) => {
      console.error("Error removing approver:", error);
      toast.error("Failed to remove approver");
    },
  });

  const updateApprover = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<TemplateApprover> & { id: string }) => {
      const { data, error } = await supabase
        .from("template_approvers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template-approvers"] });
      toast.success("Approver updated successfully");
    },
    onError: (error) => {
      console.error("Error updating approver:", error);
      toast.error("Failed to update approver");
    },
  });

  return {
    approvers,
    isLoading,
    addApprover,
    removeApprover,
    updateApprover,
  };
}
