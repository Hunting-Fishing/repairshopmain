
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { pushToExternalMonitoring } from "./monitoring/externalIntegrations";
import { defaultValidator } from "./monitoring/apiValidation";

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
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...logEntry.metadata
    }
  };

  try {
    const { error: logError } = await supabase.from('audit_logs').insert(entry);
    if (logError) throw logError;

    // Check if we need to trigger alerts based on error severity
    if (entry.level === 'error') {
      await checkErrorThresholds();
    }
  } catch (logError) {
    console.error('Failed to log error:', logError);
  }
}

async function checkErrorThresholds() {
  try {
    // Get error count in the last hour
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentErrors, error } = await supabase
      .from('audit_logs')
      .select('id')
      .eq('level', 'error')
      .gte('created_at', hourAgo);

    if (error) throw error;

    // If more than 10 errors in the last hour, trigger alert
    if (recentErrors && recentErrors.length >= 10) {
      await triggerSystemAlert({
        type: 'high_error_rate',
        message: `High error rate detected: ${recentErrors.length} errors in the last hour`,
        severity: 'critical'
      });
    }
  } catch (error) {
    console.error('Failed to check error thresholds:', error);
  }
}

async function triggerSystemAlert(alert: {
  type: string;
  message: string;
  severity: 'warning' | 'critical';
}) {
  try {
    const { error } = await supabase.from('system_alerts').insert({
      ...alert,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    if (error) throw error;
    
    // Show alert in UI
    if (alert.severity === 'critical') {
      toast.error(alert.message, {
        duration: 10000, // 10 seconds for critical alerts
      });
    } else {
      toast.warning(alert.message);
    }
  } catch (error) {
    console.error('Failed to trigger system alert:', error);
  }
}

export function handleQueryError(error: Error, context: string) {
  logError(error, {
    action_type: 'query_error',
    table_name: context,
    level: 'error'
  });
  
  toast.error(`Failed to ${context}`);
  throw error;
}

export async function logSystemMetrics(metrics: {
  cpu_usage: number;
  memory_usage: number;
  error_rate: number;
  response_time: number;
}) {
  try {
    const { error } = await supabase.from('system_configuration').upsert({
      metrics: metrics,
      last_check: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (error) throw error;

    // Check for performance alerts
    if (metrics.cpu_usage > 90 || metrics.memory_usage > 90) {
      await triggerSystemAlert({
        type: 'high_resource_usage',
        message: `High resource usage detected - CPU: ${metrics.cpu_usage}%, Memory: ${metrics.memory_usage}%`,
        severity: 'critical'
      });
    } else if (metrics.error_rate > 5) {
      await triggerSystemAlert({
        type: 'high_error_rate',
        message: `High error rate detected: ${metrics.error_rate}%`,
        severity: 'warning'
      });
    }
  } catch (error) {
    console.error('Failed to log system metrics:', error);
  }
}

export function trackSystemPerformance() {
  const metrics = {
    cpu_usage: Math.random() * 100,
    memory_usage: Math.random() * 100,
    error_rate: Math.random() * 5,
    response_time: Math.random() * 1000
  };

  // Push metrics to external monitoring
  pushToExternalMonitoring({
    timestamp: new Date().toISOString(),
    metrics
  });

  return logSystemMetrics(metrics);
}

// Add API validation helper
export async function validateAndExecute<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    const result = await defaultValidator.withRetry(operation);
    return result;
  } catch (error) {
    handleQueryError(error as Error, context);
    throw error;
  }
}
