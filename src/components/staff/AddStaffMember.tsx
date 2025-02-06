
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddStaffMemberForm } from "./add-staff-member/AddStaffMemberForm";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";

export function AddStaffMember() {
  const { userProfile, customRoles } = useOrganizationData();

  if (!userProfile?.organization_id) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Add Staff Member
          </DialogTitle>
        </DialogHeader>
        <AddStaffMemberForm 
          organizationId={userProfile.organization_id} 
          customRoles={customRoles} 
        />
      </DialogContent>
    </Dialog>
  );
}
