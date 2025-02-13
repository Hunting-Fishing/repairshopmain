
import { supabase } from '@/integrations/supabase/client';
import { ReportTemplate } from '../types';

export interface GenerateReportParams {
  templateId: string;
  parameters?: Record<string, any>;
}

export interface ReportGenerationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output_url?: string;
  error_message?: string;
}

export async function generateReport({ templateId, parameters = {} }: GenerateReportParams) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Create a generation job
  const { data: job, error: jobError } = await supabase
    .from('report_generation_jobs')
    .insert({
      template_id: templateId,
      parameters,
      status: 'pending',
      created_by: user.id
    })
    .select()
    .single();

  if (jobError) throw jobError;
  return job;
}

export async function getReportStatus(jobId: string) {
  const { data: job, error } = await supabase
    .from('report_generation_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) throw error;
  return job as ReportGenerationJob;
}

export async function getReportDataSources() {
  const { data, error } = await supabase
    .from('report_data_sources')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getReportLayouts(templateId: string) {
  const { data, error } = await supabase
    .from('report_template_layouts')
    .select('*')
    .eq('template_id', templateId)
    .order('name');

  if (error) throw error;
  return data;
}

export async function scheduleReport(templateId: string, schedule: any) {
  const { data, error } = await supabase
    .from('report_schedules')
    .insert({
      template_id: templateId,
      ...schedule
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
