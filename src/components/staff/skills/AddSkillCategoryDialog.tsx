
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function AddSkillCategoryDialog({ open, onOpenChange }: AddSkillCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (values: FormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No authenticated user found');
      }

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!userProfile?.organization_id) {
        throw new Error('No organization found');
      }

      const { error } = await supabase
        .from('skill_categories')
        .insert([{
          ...values,
          organization_id: userProfile.organization_id
        }]);

      if (error) throw error;

      // First invalidate the query and wait for it to complete
      await queryClient.invalidateQueries({ queryKey: ['skill-categories-with-skills'] });
      
      // Then show success message
      toast.success("Skill category added successfully");
      
      // Finally close the dialog and reset state
      setIsSubmitting(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding skill category:', error);
      toast.error("Failed to add skill category");
      setIsSubmitting(false);
    }
  };

  // Prevent dialog from closing while submitting
  const handleClose = (value: boolean) => {
    if (!isSubmitting) {
      onOpenChange(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onEscapeKeyDown={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Add Skill Category</DialogTitle>
        </DialogHeader>
        <CategoryForm 
          onSubmit={handleSubmit} 
          onCancel={() => handleClose(false)} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
}
