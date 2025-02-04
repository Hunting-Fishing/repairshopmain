import { Badge } from "@/components/ui/badge";
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
  return (
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
      <Badge className={getProficiencyColor(assessment.proficiency_level)}>
        {getProficiencyLabel(assessment.proficiency_level)}
      </Badge>
    </div>
  );
}