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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            {staffMember && <StaffDetailsForm staffMember={staffMember} onClose={() => onOpenChange(false)} />}
          </TabsContent>
          <TabsContent value="skills">
            <SkillAssessmentDashboard profileId={staffMemberId} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}