import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddStaffMemberForm } from "./add-staff-member/AddStaffMemberForm";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";

export function AddStaffMember() {
  const { userProfile, customRoles } = useOrganizationData();

  if (!userProfile?.organization_id) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add Staff Member
        </CardTitle>
        <CardDescription>
          Add a new staff member to your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AddStaffMemberForm 
          organizationId={userProfile.organization_id} 
          customRoles={customRoles} 
        />
      </CardContent>
    </Card>
  );
}