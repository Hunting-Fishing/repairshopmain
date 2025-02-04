import { useState } from "react";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { StaffListSkeleton } from "./StaffListSkeleton";
import { StaffTableHeader } from "./StaffTableHeader";
import { StaffTableRow } from "./StaffTableRow";
import { StaffDetailsDialog } from "../staff-details/StaffDetailsDialog";
import { useStaffMembers } from "@/hooks/staff/useStaffMembers";

export function StaffList() {
  const { data: staffMembers, isLoading } = useStaffMembers();
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  if (isLoading) return <StaffListSkeleton />;

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <StaffTableHeader />
          <TableBody>
            {staffMembers?.map((staff) => (
              <StaffTableRow 
                key={staff.id} 
                staff={staff}
                onViewDetails={() => setSelectedStaffId(staff.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedStaffId && (
        <StaffDetailsDialog
          staffMemberId={selectedStaffId}
          open={!!selectedStaffId}
          onOpenChange={(open) => !open && setSelectedStaffId(null)}
        />
      )}
    </>
  );
}