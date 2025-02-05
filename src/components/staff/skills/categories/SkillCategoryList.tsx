
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { SkillCategoryCard } from "./SkillCategoryCard";
import { AddSkillCategoryDialog } from "../AddSkillCategoryDialog";
import { toast } from "sonner";
import type { SkillCategory } from "../types";

export function SkillCategoryList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: categories, isLoading, isError, error } = useQuery({
    queryKey: ['skill-categories-with-skills'],
    queryFn: async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        
        if (!session?.user?.id) {
          throw new Error('Authentication required');
        }

        const { data: userProfile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!userProfile?.organization_id) {
          throw new Error('Organization not found');
        }

        const { data, error } = await supabase
          .from('skill_categories')
          .select(`
            id,
            name,
            description,
            skills (
              id,
              name,
              description
            )
          `)
          .eq('organization_id', userProfile.organization_id)
          .order('name');
        
        if (error) throw error;
        return data as SkillCategory[];
      } catch (error) {
        console.error('Error fetching skill categories:', error);
        if (error instanceof Error) {
          if (error.message === 'Authentication required') {
            toast.error("Please sign in to view skill categories");
          } else if (error.message === 'Organization not found') {
            toast.error("Organization settings not found");
          } else {
            toast.error("Failed to load skill categories: " + error.message);
          }
        } else {
          toast.error("An unexpected error occurred while loading categories");
        }
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    meta: {
      errorMessage: "Failed to load skill categories"
    }
  });

  const handleAddClick = () => {
    try {
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error opening dialog:', error);
      toast.error("Failed to open add category dialog");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load skill categories. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={handleAddClick} 
          size="sm"
          className="relative"
          disabled={isDialogOpen}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category) => (
          <SkillCategoryCard key={category.id} category={category} />
        ))}
        {!categories?.length && (
          <p className="text-muted-foreground col-span-full text-center py-4">
            No skill categories found. Add one to get started.
          </p>
        )}
      </div>
      <AddSkillCategoryDialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => setIsDialogOpen(false), 100);
          } else {
            setIsDialogOpen(open);
          }
        }} 
      />
    </div>
  );
}
