import { SkillAssessmentCard } from "./SkillAssessmentCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { SkillAssessment } from "../types";
import { getProficiencyColor, getProficiencyLabel } from "../utils/proficiencyUtils";

interface SkillAssessmentListProps {
  assessments?: SkillAssessment[];
  isLoading: boolean;
}

export function SkillAssessmentList({ assessments, isLoading }: SkillAssessmentListProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!assessments?.length) {
    return (
      <p className="text-center text-muted-foreground py-4">
        No skill assessments found
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <SkillAssessmentCard
          key={assessment.id}
          assessment={assessment}
          getProficiencyColor={getProficiencyColor}
          getProficiencyLabel={getProficiencyLabel}
        />
      ))}
    </div>
  );
}