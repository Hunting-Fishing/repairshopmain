
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ViewState } from "@/types/dashboard";
import { useDebouncedCallback } from "use-debounce";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function useViewState(viewType: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: viewState, isLoading } = useQuery({
    queryKey: ['view-state', viewType, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_view_state')
        .select(`
          id,
          user_id,
          view_type,
          state,
          view_mode,
          is_calendar_expanded,
          search_filters,
          sort_preferences,
          pagination_settings,
          created_at,
          updated_at
        `)
        .eq('user_id', user.id)
        .eq('view_type', viewType)
        .maybeSingle();

      if (error) {
        console.error("Error fetching view state:", error);
        toast.error("Failed to load view preferences");
        throw error;
      }

      // If no data exists, create default state
      if (!data) {
        const defaultState: Partial<ViewState> = {
          user_id: user.id,
          view_type: viewType,
          state: {},
          view_mode: 'calendar',
          is_calendar_expanded: false,
          search_filters: {},
          sort_preferences: { field: 'created_at', direction: 'desc' },
          pagination_settings: { itemsPerPage: 10, currentPage: 1 }
        };

        const { data: newState, error: insertError } = await supabase
          .from('user_view_state')
          .insert([defaultState])
          .select()
          .single();

        if (insertError) {
          console.error("Error creating view state:", insertError);
          toast.error("Failed to initialize view preferences");
          throw insertError;
        }

        return newState;
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  const updateViewStateWithRetry = async (updates: Partial<ViewState>, retryCount = 0) => {
    if (!user?.id || !viewState?.id) return null;

    try {
      const payload = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_view_state')
        .update(payload)
        .eq('id', viewState.id)
        .eq('user_id', user.id);

      if (error) {
        // Check if it's a deadlock error
        if (error.code === '40P01' && retryCount < MAX_RETRIES) {
          console.log(`Deadlock detected, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
          return updateViewStateWithRetry(updates, retryCount + 1);
        }
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error("Error updating view state:", error);
      // Only show toast error on final retry
      if (retryCount === MAX_RETRIES) {
        toast.error("Failed to save view preferences");
      }
      throw error;
    }
  };

  const { mutate: updateViewState } = useMutation({
    mutationFn: updateViewStateWithRetry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['view-state', viewType, user?.id] });
    },
    onError: (error: any) => {
      console.error("Error updating view state:", error);
      // Error toast is now handled in updateViewStateWithRetry
    }
  });

  // Use debounce to prevent too many simultaneous updates
  const debouncedUpdateViewState = useDebouncedCallback(
    (updates: Partial<ViewState>) => {
      updateViewState(updates);
    },
    500, // Increased debounce time to further reduce concurrent updates
    { maxWait: 2000 } // Maximum wait time for debounced updates
  );

  return {
    viewState,
    isLoading,
    updateViewState: debouncedUpdateViewState
  };
}
