
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { StaffMember } from "@/types/staff";
import { useDeleteStaffMember } from "@/hooks/staff/useDeleteStaffMember";
import { toast } from "@/hooks/use-toast";

interface DeleteStaffDialogProps {
  isOpen: boolean;
  staffMember: StaffMember | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteStaffDialog({ 
  isOpen, 
  staffMember, 
  onClose, 
  onSuccess 
}: DeleteStaffDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteStaffMember } = useDeleteStaffMember();

  if (!staffMember) return null;

  const handleDelete = async () => {
    if (!staffMember) return;
    
    setIsDeleting(true);
    try {
      await deleteStaffMember(staffMember.id);
      toast({
        title: "Staff member deleted",
        description: `${staffMember.first_name} ${staffMember.last_name} has been removed.`,
        variant: "default"
      });
      onSuccess();
    } catch (error) {
      console.error("Error deleting staff member:", error);
      toast({
        title: "Error",
        description: "Failed to delete staff member. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {staffMember.first_name} {staffMember.last_name}'s account.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isDeleting}
            loading={isDeleting}
            loadingText="Deleting..."
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
