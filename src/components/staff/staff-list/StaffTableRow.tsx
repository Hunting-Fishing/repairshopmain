import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { StaffContactInfo } from "./StaffContactInfo";
import { StaffDetailsDialog } from "../staff-details/StaffDetailsDialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StaffTableRowProps {
  staff: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone_number: string | null;
    role: string;
  };
}

export function StaffTableRow({ staff }: StaffTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  return (
    <TableRow>
      <TableCell>
        {staff.first_name} {staff.last_name}
      </TableCell>
      <TableCell>
        <StaffContactInfo email={staff.email} phone={staff.phone_number} />
      </TableCell>
      <TableCell>
        <Badge variant="outline">{staff.role}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{skillCount} skills</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDetailsOpen(true)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </TableCell>
      <StaffDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        staffMemberId={staff.id}
      />
    </TableRow>
  );
}