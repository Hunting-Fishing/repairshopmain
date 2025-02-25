
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffDetailsForm } from "./StaffDetailsForm";
import { SkillAssessmentDashboard } from "../skills/SkillAssessmentDashboard";
import { useStaffMemberDetails } from "@/hooks/staff/useStaffMemberDetails";

interface StaffDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffMemberId: string;
}

export function StaffDetailsDialog({
  open,
  onOpenChange,
  staffMemberId,
}: StaffDetailsDialogProps) {
  const { data: staffMember } = useStaffMemberDetails(staffMemberId);

  if (!staffMember) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <StaffDetailsForm 
              staffMember={{
                id: staffMember.id,
                first_name: staffMember.first_name,
                last_name: staffMember.last_name,
                email: staffMember.email,
                phone_number: staffMember.phone_number,
                notes: staffMember.notes,
                emergency_contact: staffMember.emergency_contact,
                skills: staffMember.skills
              }} 
              onClose={() => onOpenChange(false)} 
            />
          </TabsContent>
          <TabsContent value="skills">
            <SkillAssessmentDashboard profileId={staffMemberId} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
