
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StaffDetailsForm } from "./StaffDetailsForm";
import { useStaffMemberDetails } from "@/hooks/staff/useStaffMemberDetails";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { type StaffMember } from "@/types/staff";

interface StaffDetailsDialogProps {
  staffId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StaffDetailsDialog({ staffId, isOpen, onClose }: StaffDetailsDialogProps) {
  const { data: staffMember, isLoading } = useStaffMemberDetails(staffId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {staffMember ? `${staffMember.first_name} ${staffMember.last_name}` : 'Staff Member Details'}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-4">
            <LoadingSpinner />
          </div>
        ) : staffMember ? (
          <StaffDetailsForm staffMember={staffMember} onClose={onClose} />
        ) : (
          <p>Staff member not found</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
