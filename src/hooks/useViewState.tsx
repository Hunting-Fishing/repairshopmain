
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ViewState } from "@/types/dashboard";
import { useDebouncedCallback } from "use-debounce";

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
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { mutate: updateViewState } = useMutation({
    mutationFn: async (updates: Partial<ViewState>) => {
      if (!user?.id) return null;

      const payload = {
        user_id: user.id,
        view_type: viewType,
        ...updates
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

  const debouncedUpdateViewState = useDebouncedCallback(
    (updates: Partial<ViewState>) => {
      updateViewState(updates);
    },
    500
  );

  return {
    viewState: viewState || {
      state: {},
      search_filters: {},
      sort_preferences: { field: 'created_at', direction: 'desc' },
      pagination_settings: { itemsPerPage: 10, currentPage: 1 }
    },
    isLoading,
    updateViewState: debouncedUpdateViewState
  };
}
