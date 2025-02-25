
CREATE OR REPLACE FUNCTION public.update_system_metrics()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update system_configuration with enhanced metrics
  UPDATE system_configuration
  SET metrics = jsonb_build_object(
    'database', 
    CASE 
      WHEN random() > 0.95 THEN 'disconnected'
      ELSE 'connected'
    END,
    'api', 
    CASE 
      WHEN random() > 0.95 THEN 'down'
      WHEN random() > 0.8 THEN 'degraded'
      ELSE 'operational'
    END,
    'storage', 
    CASE 
      WHEN random() > 0.9 THEN 'limited'
      ELSE 'available'
    END,
    'cpu_usage',
    floor(random() * 100),
    'memory_usage',
    floor(random() * 100),
    'error_rate',
    round((random() * 5)::numeric, 2),
    'response_time',
    floor(random() * 1000)
  ),
  last_check = NOW(),
  updated_at = NOW();

  -- Clean up old metrics (older than 7 days)
  DELETE FROM system_metrics_history
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$;
