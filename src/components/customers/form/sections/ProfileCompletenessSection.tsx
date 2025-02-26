
import { Progress } from "@/components/ui/progress";

interface ProfileCompletenessSectionProps {
  score: number;
  recommendations: string[];
}

export function ProfileCompletenessSection({
  score,
  recommendations
}: ProfileCompletenessSectionProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-sm font-medium">Profile Completeness</h3>
        <span className="text-sm text-muted-foreground">{Math.round(score)}%</span>
      </div>
      <Progress value={score} className="h-2" />
      {recommendations.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">Recommendations:</p>
          <ul className="text-sm text-muted-foreground list-disc list-inside">
            {recommendations.slice(0, 3).map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
