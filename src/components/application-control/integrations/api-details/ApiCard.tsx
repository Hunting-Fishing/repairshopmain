import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { ApiFeatureList } from "./ApiFeatureList";

interface ApiCardProps {
  name: string;
  status: "active" | "coming_soon";
  icon: LucideIcon;
  endpoint?: string;
  description: string;
  features: string[];
}

export const ApiCard = ({ name, status, icon: Icon, endpoint, description, features }: ApiCardProps) => {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              {name}
              <Badge variant={status === 'active' ? "default" : "secondary"}>
                {status === 'active' ? 'Active' : 'Coming Soon'}
              </Badge>
            </h4>
          </div>
          
          {status === 'active' && endpoint && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Endpoint:</p>
              <code className="bg-muted px-2 py-1 rounded text-xs">{endpoint}</code>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground">{description}</p>
          <ApiFeatureList features={features} />
        </div>
      </div>
    </div>
  );
};