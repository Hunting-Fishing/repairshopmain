import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { User, Phone, Mail, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StaffListSkeleton } from "./StaffListSkeleton";

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

      // First get all profiles in the organization
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          *,
          custom_roles (
            name
          )
        `)
        .eq("organization_id", userProfile.organization_id);

      if (error) throw error;

      // Then get the emails for these profiles from auth.users
      const { data: emails } = await supabase
        .from('auth')
        .select('id, email')
        .in('id', profiles.map(p => p.id));

      // Combine the data
      return profiles.map(profile => ({
        ...profile,
        email: emails?.find(e => e.id === profile.id)?.email || ''
      })) as StaffMember[];
    },
  });

  if (isLoading) return <StaffListSkeleton />;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Hire Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffMembers?.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {staff.first_name} {staff.last_name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${staff.email}`}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      {staff.email}
                    </a>
                  </div>
                  {staff.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${staff.phone_number}`}
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        {staff.phone_number}
                      </a>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {staff.role === "custom" ? (
                  staff.custom_roles?.name
                ) : (
                  staff.role.replace("_", " ")
                )}
              </TableCell>
              <TableCell>
                {staff.hire_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(staff.hire_date), "PP")}
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={staff.status === "active" ? "default" : "secondary"}
                >
                  {staff.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}