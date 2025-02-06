
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, KeyRound } from "lucide-react";
import { StaffContactInfo } from "./StaffContactInfo";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";
import { toast } from "sonner";

interface StaffTableRowProps {
  staff: StaffMember;
  onViewDetails: () => void;
}

export function StaffTableRow({ staff, onViewDetails }: StaffTableRowProps) {
  const { data: skillCount } = useQuery({
    queryKey: ['staff-skill-count', staff.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('staff_skill_assessments')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', staff.id);
      
      if (error) throw error;
      return count || 0;
    }
  });

  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.rpc('reset_staff_password', {
        staff_id: staff.id
      });

      if (error) throw error;

      toast.success("Password has been reset to default");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Failed to reset password");
    }
  };

  return (
    <TableRow>
      <TableCell>
        {staff.first_name} {staff.last_name}
      </TableCell>
      <TableCell>
        <StaffContactInfo email={staff.email} phoneNumber={staff.phone_number} />
      </TableCell>
      <TableCell>
        <Badge variant="outline">{staff.role}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{skillCount} skills</Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetPassword}
            title="Reset Password"
          >
            <KeyRound className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onViewDetails}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
