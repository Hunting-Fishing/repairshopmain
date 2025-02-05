import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SkillAssessmentDialog } from "./SkillAssessmentDialog";
import { SkillAssessmentList } from "./components/SkillAssessmentList";
import { useSkillAssessments } from "./hooks/useSkillAssessments";

interface SkillAssessmentDashboardProps {
  profileId?: string;
}

export function SkillAssessmentDashboard({ profileId }: SkillAssessmentDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: assessments, isLoading } = useSkillAssessments(profileId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Skill Assessments</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Assessment
        </Button>
      </CardHeader>
      <CardContent>
        <SkillAssessmentList 
          assessments={assessments} 
          isLoading={isLoading} 
        />
      </CardContent>
      <SkillAssessmentDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        profileId={profileId}
      />
    </Card>
  );
}