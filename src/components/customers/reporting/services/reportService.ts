import { supabase } from '@/integrations/supabase/client';
import type { ReportTemplate, ReportSchedule, ReportGenerationJob, ReportOutput } from '../types';

export interface GenerateReportParams {
  templateId: string;
  parameters?: Record<string, any>;
}

export async function generateReport({ templateId, parameters = {} }: GenerateReportParams): Promise<ReportGenerationJob> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (!profile?.organization_id) throw new Error('Organization not found');

  const { data, error } = await supabase
    .from('report_generation_jobs')
    .insert({
      template_id: templateId,
      parameters,
      status: 'pending',
      created_by: user.id,
      organization_id: profile.organization_id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getReportLayouts(): Promise<any[]> {
  const { data, error } = await supabase
    .from('report_template_layouts')
    .select('*');

  if (error) throw error;
  return data || [];
}

export async function scheduleReport(templateId: string, schedule: Partial<ReportSchedule>): Promise<ReportSchedule> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (!profile?.organization_id) throw new Error('Organization not found');

  const { data, error } = await supabase
    .from('report_schedules')
    .insert({
      ...schedule,
      template_id: templateId,
      created_by: user.id,
      organization_id: profile.organization_id,
      status: 'pending_approval'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getReportStatus(jobId: string): Promise<ReportGenerationJob> {
  const { data, error } = await supabase
    .from('report_generation_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) throw error;
  return data;
}

export async function getReportOutput(outputId: string): Promise<ReportOutput> {
  const { data, error } = await supabase
    .from('report_outputs')
    .select('*')
    .eq('id', outputId)
    .single();

  if (error) throw error;
  return data;
}
