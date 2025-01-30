import { LucideIcon } from "lucide-react";

interface ApiFeatureListProps {
  features: string[];
}

export const ApiFeatureList = ({ features }: ApiFeatureListProps) => {
  return (
    <div className="grid grid-cols-1 gap-2 mt-2">
      {features.map((feature, index) => (
        <div key={index} className="text-sm flex items-center gap-2">
          <span className="text-xs">•</span>
          {feature}
        </div>
      ))}
    </div>
  );
};