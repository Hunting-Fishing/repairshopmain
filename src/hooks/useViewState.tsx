
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ViewState {
  id?: string;
  view_type: string;
  state: Record<string, any>;
}

export function useViewState(viewType: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: viewState, isLoading } = useQuery({
    queryKey: ['view-state', viewType, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_view_state')
        .select('*')
        .eq('user_id', user.id)
        .eq('view_type', viewType)
        .maybeSingle();

      if (error) {
        console.error("Error fetching view state:", error);
        toast.error("Failed to load view preferences");
        throw error;
      }

      return data;
    },
    enabled: !!user?.id
  });

  const { mutate: updateViewState } = useMutation({
    mutationFn: async (newState: Partial<Record<string, any>>) => {
      if (!user?.id) return null;

      const payload = {
        user_id: user.id,
        view_type: viewType,
        state: newState
      };

      if (viewState?.id) {
        const { error } = await supabase
          .from('user_view_state')
          .update(payload)
          .eq('id', viewState.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_view_state')
          .insert([payload]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['view-state', viewType, user?.id] });
    },
    onError: (error: any) => {
      console.error("Error updating view state:", error);
      toast.error("Failed to save view preferences");
    }
  });

  return {
    viewState: viewState?.state || {},
    isLoading,
    updateViewState
  };
}
