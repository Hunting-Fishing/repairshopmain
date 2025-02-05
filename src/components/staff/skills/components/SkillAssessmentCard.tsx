
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SkillAssessmentHistory } from "./SkillAssessmentHistory";
import { History } from "lucide-react";
import type { SkillAssessment } from "../types";

interface SkillAssessmentCardProps {
  assessment: SkillAssessment;
  getProficiencyColor: (level: number) => string;
  getProficiencyLabel: (level: number) => string;
}

export function SkillAssessmentCard({ 
  assessment, 
  getProficiencyColor, 
  getProficiencyLabel 
}: SkillAssessmentCardProps) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-1">
          <div className="font-medium">{assessment.skill?.name}</div>
          {assessment.skill?.category && (
            <Badge variant="secondary">
              {assessment.skill.category.name}
            </Badge>
          )}
          {assessment.notes && (
            <p className="text-sm text-muted-foreground">{assessment.notes}</p>
          )}
          {assessment.assessor && (
            <div className="text-sm text-muted-foreground">
              Assessed by: {assessment.assessor.first_name} {assessment.assessor.last_name}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getProficiencyColor(assessment.proficiency_level)}>
            {getProficiencyLabel(assessment.proficiency_level)}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHistory(!showHistory)}
            className="ml-2"
          >
            <History className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {showHistory && (
        <SkillAssessmentHistory assessmentId={assessment.id} />
      )}
    </div>
  );
}
