
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AlertRule {
  metric: string;
  threshold: number;
  operator: 'gt' | 'lt' | 'eq';
  severity: 'warning' | 'critical';
}

const defaultRules: AlertRule[] = [
  {
    metric: 'cpu_usage',
    threshold: 90,
    operator: 'gt',
    severity: 'critical'
  },
  {
    metric: 'memory_usage',
    threshold: 85,
    operator: 'gt',
    severity: 'warning'
  },
  {
    metric: 'error_rate',
    threshold: 5,
    operator: 'gt',
    severity: 'warning'
  },
  {
    metric: 'response_time',
    threshold: 1000,
    operator: 'gt',
    severity: 'warning'
  }
];

export async function evaluateMetrics(metrics: Record<string, number>) {
  try {
    for (const rule of defaultRules) {
      const value = metrics[rule.metric];
      if (!value) continue;

      let threshold_exceeded = false;
      switch (rule.operator) {
        case 'gt':
          threshold_exceeded = value > rule.threshold;
          break;
        case 'lt':
          threshold_exceeded = value < rule.threshold;
          break;
        case 'eq':
          threshold_exceeded = value === rule.threshold;
          break;
      }

      if (threshold_exceeded) {
        await createAlert({
          type: `high_${rule.metric}`,
          message: `${rule.metric.replace('_', ' ')} is at ${value} (threshold: ${rule.threshold})`,
          severity: rule.severity
        });
      }
    }
  } catch (error) {
    console.error('Error evaluating metrics:', error);
  }
}

interface AlertData {
  type: string;
  message: string;
  severity: 'warning' | 'critical';
}

async function createAlert(alert: AlertData) {
  try {
    const { error } = await supabase
      .from('system_alerts')
      .insert({
        type: alert.type,
        message: alert.message,
        severity: alert.severity,
        status: 'pending'
      });

    if (error) throw error;

    if (alert.severity === 'critical') {
      toast.error(alert.message, {
        duration: 10000
      });
    } else {
      toast.warning(alert.message);
    }
  } catch (error) {
    console.error('Error creating alert:', error);
  }
}
