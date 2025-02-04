import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";

interface Skill {
  id: string;
  name: string;
  category: {
    name: string;
  } | null;
}

const formSchema = z.object({
  skillId: z.string().min(1, "Skill is required"),
  proficiencyLevel: z.string().transform((val) => parseInt(val, 10)),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SkillAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId?: string;
}

export function SkillAssessmentDialog({ open, onOpenChange, profileId }: SkillAssessmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: skills } = useQuery<Skill[]>({
    queryKey: ['skills-for-assessment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          id,
          name,
          category:skill_categories(name)
        `)
        .order('name');
      
      if (error) throw error;
      
      // Transform the data to match our Skill interface
      return (data as any[]).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category ? { name: item.category.name } : null
      }));
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillId: "",
      notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!profileId) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('staff_skill_assessments')
        .insert([{
          profile_id: profileId,
          skill_id: values.skillId,
          proficiency_level: values.proficiencyLevel,
          notes: values.notes,
          assessed_by: (await supabase.auth.getSession()).data.session?.user.id,
        }]);

      if (error) throw error;

      toast.success("Skill assessment added successfully");
      queryClient.invalidateQueries({ queryKey: ['skill-assessments', profileId] });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error adding skill assessment:', error);
      toast.error("Failed to add skill assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Skill Assessment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="skillId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a skill" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skills?.map((skill) => (
                        <SelectItem key={skill.id} value={skill.id}>
                          {skill.name} {skill.category && `(${skill.category.name})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proficiencyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proficiency Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select proficiency level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 - Beginner</SelectItem>
                      <SelectItem value="2">2 - Advanced Beginner</SelectItem>
                      <SelectItem value="3">3 - Competent</SelectItem>
                      <SelectItem value="4">4 - Proficient</SelectItem>
                      <SelectItem value="5">5 - Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Add any additional notes..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Assessment"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}