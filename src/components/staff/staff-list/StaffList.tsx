import { useState } from "react";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { StaffListSkeleton } from "./StaffListSkeleton";
import { StaffTableHeader } from "./StaffTableHeader";
import { StaffTableRow } from "./StaffTableRow";
import { StaffDetailsDialog } from "../staff-details/StaffDetailsDialog";
import { useStaffMembers } from "@/hooks/staff/useStaffMembers";

const ITEMS_PER_PAGE = 10;

export function StaffList() {
  const { data: staffMembers, isLoading, error } = useStaffMembers();
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading staff members. Please try again.
      </div>
    );
  }

  if (isLoading) return <StaffListSkeleton />;

  const filteredStaff = staffMembers?.filter(staff => 
    `${staff.first_name} ${staff.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil((filteredStaff?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStaff = filteredStaff.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <StaffTableHeader />
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredStaff.length)} of {filteredStaff.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

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