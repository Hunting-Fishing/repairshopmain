import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { StaffListSkeleton } from "./StaffListSkeleton";
import { StaffTableHeader } from "./StaffTableHeader";
import { StaffTableRow } from "./StaffTableRow";
import { StaffDetailsDialog } from "../staff-details/StaffDetailsDialog";
import { useStaffMembers } from "@/hooks/staff/useStaffMembers";
import type { StaffMember } from "@/types/staff";
import { StaffSearch } from "./components/StaffSearch";
import { StaffPagination } from "./components/StaffPagination";

const ITEMS_PER_PAGE = 10;

type SortField = 'name' | 'role' | 'skills';
type SortOrder = 'asc' | 'desc';

export function StaffList() {
  const { data: staffMembers, isLoading, error } = useStaffMembers();
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading staff members. Please try again.
      </div>
    );
  }

  if (isLoading) return <StaffListSkeleton />;

  const sortStaff = (staff: StaffMember[]) => {
    return [...staff].sort((a, b) => {
      if (sortField === 'name') {
        const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
        const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
        return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }
      if (sortField === 'role') {
        return sortOrder === 'asc' 
          ? a.role.localeCompare(b.role)
          : b.role.localeCompare(a.role);
      }
      return 0;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredStaff = staffMembers?.filter(staff => 
    `${staff.first_name} ${staff.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedStaff = sortStaff(filteredStaff);
  const totalPages = Math.ceil(sortedStaff.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStaff = sortedStaff.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <StaffSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <StaffTableHeader onSort={handleSort} sortField={sortField} sortOrder={sortOrder} />
          <TableBody>
            {paginatedStaff.map((staff) => (
              <StaffTableRow 
                key={staff.id} 
                staff={staff}
                onViewDetails={() => setSelectedStaffId(staff.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <StaffPagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={startIndex + ITEMS_PER_PAGE}
        totalItems={sortedStaff.length}
        onPageChange={setCurrentPage}
      />

      {selectedStaffId && (
        <StaffDetailsDialog
          staffMemberId={selectedStaffId}
          open={!!selectedStaffId}
          onOpenChange={(open) => !open && setSelectedStaffId(null)}
        />
      )}
    </div>
  );
}