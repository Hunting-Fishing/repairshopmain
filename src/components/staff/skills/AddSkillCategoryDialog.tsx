
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddSkillCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CategoryForm({ onSubmit, onCancel, isSubmitting }: { 
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      // Let the error propagate to parent for handling
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Electrical Systems" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe this skill category..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? "Adding..." : "Add Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function AddSkillCategoryDialog({ open, onOpenChange }: AddSkillCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const queryClient = useQueryClient();

  // Reset states when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setIsSubmitting(false);
      setHasError(false);
      setRetryCount(0);
    }
  }, [open]);

  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setHasError(false);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
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

      const { error: insertError } = await supabase
        .from('skill_categories')
        .insert([{
          ...values,
          organization_id: userProfile.organization_id
        }]);

      if (insertError) {
        // Check for specific database errors
        if (insertError.code === '23505') { // Unique violation
          throw new Error('A category with this name already exists');
        }
        throw insertError;
      }

      // Wait for query invalidation to complete
      await queryClient.invalidateQueries({ 
        queryKey: ['skill-categories-with-skills']
      });
      
      toast.success("Skill category added successfully");
      
      // Ensure we're still mounted before updating state
      setIsSubmitting(false);
      setHasError(false);
      setRetryCount(0);
      
      // Add a small delay before closing to ensure states are updated
      setTimeout(() => onOpenChange(false), 100);
      
    } catch (error) {
      console.error('Error adding skill category:', error);
      setHasError(true);
      
      if (error instanceof Error) {
        if (error.message === 'Authentication required') {
          toast.error("Please sign in to add a skill category");
        } else if (error.message === 'Organization not found') {
          toast.error("Organization settings not found");
        } else {
          toast.error("Failed to add skill category: " + error.message);
        }

        // Increment retry count for non-auth/org errors
        if (error.message !== 'Authentication required' && 
            error.message !== 'Organization not found') {
          setRetryCount(prev => prev + 1);
        }
      } else {
        toast.error("An unexpected error occurred");
        setRetryCount(prev => prev + 1);
      }
      
      setIsSubmitting(false);
    }
  };

  const handleClose = (value: boolean) => {
    // Only allow closing if not submitting or if explicitly cancelled
    if (!isSubmitting) {
      // Reset error state when closing
      setHasError(false);
      onOpenChange(value);
    }
  };

  // Show warning if multiple retries
  useEffect(() => {
    if (retryCount >= 3) {
      toast.error("Multiple failures detected. Please try again later or contact support.");
    }
  }, [retryCount]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onEscapeKeyDown={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        onPointerDownOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        className={`transition-all duration-200 ${hasError ? "border-red-500" : ""}`}
      >
        <DialogHeader>
          <DialogTitle>Add Skill Category</DialogTitle>
        </DialogHeader>
        <CategoryForm 
          onSubmit={handleSubmit} 
          onCancel={() => handleClose(false)} 
          isSubmitting={isSubmitting} 
        />
        {hasError && retryCount >= 2 && (
          <p className="text-sm text-red-500 mt-2">
            Having trouble? Try refreshing the page or contact support if the issue persists.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
