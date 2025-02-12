
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EmailTemplate, EmailTemplateCategory } from "../types";
import { toast } from "sonner";
import type { TemplateFilters } from "../types/template-system";

export function useEmailTemplates(filters?: Partial<TemplateFilters>) {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['email-templates', filters],
    queryFn: async () => {
      let query = supabase
        .from('email_templates')
        .select('*')
        .order(filters?.sortBy || 'created_at', { ascending: filters?.sortOrder === 'asc' });

      // Apply filters
      if (filters?.searchQuery) {
        query = query.textSearch('name || subject || content', filters.searchQuery);
      }

      if (filters?.categories?.length) {
        query = query.in('category_id', filters.categories);
      }

      if (filters?.tags?.length) {
        query = query.contains('search_tags', filters.tags);
      }

      if (filters?.status === 'archived') {
        query = query.eq('is_archived', true);
      } else if (filters?.status === 'active') {
        query = query.eq('is_archived', false);
      }

      if (filters?.dateRange) {
        query = query.gte('created_at', filters.dateRange.from.toISOString())
          .lte('created_at', filters.dateRange.to.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as EmailTemplate[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['email-template-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_template_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as EmailTemplateCategory[];
    },
  });

  const createTemplate = useMutation({
    mutationFn: async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('email_templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast.success('Template created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create template');
      console.error('Error creating template:', error);
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async (template: Partial<EmailTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from('email_templates')
        .update(template)
        .eq('id', template.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast.success('Template updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update template');
      console.error('Error updating template:', error);
    },
  });

  const archiveTemplate = useMutation({
    mutationFn: async ({ id, archive }: { id: string; archive: boolean }) => {
      const { data, error } = await supabase
        .from('email_templates')
        .update({
          is_archived: archive,
          last_archive_date: archive ? new Date().toISOString() : null,
          archived_by: archive ? (await supabase.auth.getUser()).data.user?.id : null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast.success(`Template ${variables.archive ? 'archived' : 'unarchived'} successfully`);
    },
    onError: (error) => {
      toast.error('Failed to update template archive status');
      console.error('Error updating template archive status:', error);
    },
  });

  return {
    templates,
    categories,
    isLoading,
    createTemplate,
    updateTemplate,
    archiveTemplate,
  };
}
