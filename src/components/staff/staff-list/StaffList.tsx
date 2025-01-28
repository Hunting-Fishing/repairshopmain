import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { StaffListSkeleton } from "./StaffListSkeleton";
import { StaffTableHeader } from "./StaffTableHeader";
import { StaffTableRow } from "./StaffTableRow";
import { DatabaseFunctions } from "@/types/database/functions";

type StaffMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone_number: string | null;
  role: string;
  hire_date: string | null;
  status: string | null;
  custom_roles: {
    name: string | null;
  } | null;
};

export function StaffList() {
  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session.user.id)
        .single();

      if (!userProfile?.organization_id) throw new Error("No organization found");

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          phone_number,
          role,
          hire_date,
          status,
          custom_roles (
            name
          )
        `)
        .eq("organization_id", userProfile.organization_id);

      if (error) throw error;

      const { data: emailData } = await supabase
        .rpc('get_organization_user_emails', { 
          org_id: userProfile.organization_id 
        }) as { data: DatabaseFunctions['get_organization_user_emails']['Returns'] };

      return profiles.map(profile => ({
        ...profile,
        email: emailData?.find((e) => e.user_id === profile.id)?.email || ''
      })) as StaffMember[];
    },
  });

  if (isLoading) return <StaffListSkeleton />;

  return (
    <div className="rounded-md border">
      <Table>
        <StaffTableHeader />
        <TableBody>
          {staffMembers?.map((staff) => (
            <StaffTableRow key={staff.id} staff={staff} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}