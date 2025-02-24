
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuthRateLimit() {
  const [isRateLimited, setIsRateLimited] = useState(false);

  const checkRateLimit = async (ipAddress: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('check_auth_rate_limit', {
        client_ip: ipAddress
      });

      if (error) {
        console.error('Rate limit check failed:', error);
        return false;
      }

      setIsRateLimited(!data);
      return data;
    } catch (err) {
      console.error('Rate limit check failed:', err);
      return false;
    }
  };

  return { isRateLimited, checkRateLimit };
}
