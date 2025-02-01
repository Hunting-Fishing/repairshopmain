import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";
import { useQueryClient } from "@tanstack/react-query";

interface AddCategoryParams {
  name: string;
  description: string;
}

export function useAddCategory() {
  const { toast } = useToast();
  const { userProfile } = useOrganizationData();
  const queryClient = useQueryClient();

  const addCategory = async ({ name, description }: AddCategoryParams) => {
    if (!userProfile?.organization_id) {
      toast({
        title: "Error",
        description: "Organization ID not found. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('inventory_categories')
        .insert([{ 
          name, 
          description,
          organization_id: userProfile.organization_id 
        }]);

      if (error) throw error;

      toast({
        title: "Category added",
        description: "The category has been successfully added.",
      });

      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { addCategory };
}