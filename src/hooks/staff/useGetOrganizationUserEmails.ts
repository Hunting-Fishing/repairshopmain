
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GetOrganizationUserEmailsArgs, GetOrganizationUserEmailsResponse } from "@/types/staff";

export function useGetOrganizationUserEmails(args: GetOrganizationUserEmailsArgs) {
  return useQuery({
    queryKey: ["organization-user-emails", args.org_id],
    queryFn: async () => {
      if (!args.org_id) {
        console.log("useGetOrganizationUserEmails - No organization ID provided");
        return [];
      }

      console.log("useGetOrganizationUserEmails - Fetching emails for org:", args.org_id);
      const { data, error } = await supabase.rpc(
        'get_organization_user_emails',
        { org_id: args.org_id }
      );

      if (error) {
        console.error("useGetOrganizationUserEmails - Error:", error);
        throw error;
      }

      return data as GetOrganizationUserEmailsResponse;
    },
    enabled: !!args.org_id,
  });
}
