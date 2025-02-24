
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ErrorLogEntry {
  action_type: string;
  table_name: string;
  error_message: string;
  level: 'error' | 'warning' | 'info';
  metadata?: Record<string, unknown>;
}

export async function logError(error: Error, logEntry: Partial<ErrorLogEntry>) {
  const entry: ErrorLogEntry = {
    action_type: logEntry.action_type || 'error',
    table_name: logEntry.table_name || 'unknown',
    error_message: error.message,
    level: logEntry.level || 'error',
    metadata: {
      stack: error.stack,
      ...logEntry.metadata
    }
  };

  try {
    await supabase.from('audit_logs').insert(entry);
  } catch (logError) {
    console.error('Failed to log error:', logError);
  }
}

export function handleQueryError(error: Error, context: string) {
  toast.error(`Failed to ${context}`);
  throw error;
}
