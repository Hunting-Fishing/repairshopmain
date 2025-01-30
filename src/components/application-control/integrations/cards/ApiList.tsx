import { CheckCircle } from "lucide-react";

interface ApiEndpoint {
  name: string;
  status: "active" | "coming_soon";
  endpoint?: string;
  description: string;
}

interface ApiListProps {
  apis?: ApiEndpoint[];
  status: "connected" | "not_connected";
}

export const ApiList = ({ apis, status }: ApiListProps) => {
  // Helper function to get the location based on API name
  const getApiLocation = (apiName: string): string => {
    switch (apiName) {
      case "VIN Decoder API":
        return "Application Control > Integrations > NHTSA";
      case "Make/Model/Year API":
        return "Application Control > Integrations > NHTSA";
      default:
        return "Not yet implemented";
    }
  };

  if (!apis?.length || status !== 'connected') return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Integrated APIs:</h4>
      <div className="space-y-1">
        {apis.map((api, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>{api.name}</span>
            {api.status === 'active' && (
              <span className="text-xs text-muted-foreground">
                (Active - {getApiLocation(api.name)})
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};