import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { StaffListSkeleton } from "./StaffListSkeleton";
import { StaffTableHeader } from "./StaffTableHeader";
import { StaffTableRow } from "./StaffTableRow";
import { useStaffMembers } from "@/hooks/staff/useStaffMembers";

export function StaffList() {
  const { data: staffMembers, isLoading } = useStaffMembers();

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