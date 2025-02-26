import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Database, FileWarning, Shield, Wrench } from "lucide-react";
import { ApiCard } from "./ApiCard";

interface NhtsaApiDetailsProps {
  connectionData: any;
}

export const NhtsaApiDetails = ({ connectionData }: NhtsaApiDetailsProps) => {
  const apis = [
    {
      name: "VIN Decoder API",
      status: "active" as const,
      icon: Database,
      endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/",
      description: "Currently integrated and active - Decode VINs to get detailed vehicle specifications",
      features: [
        "Vehicle make, model, and year",
        "Engine specifications",
        "Vehicle type and body class",
        "Safety features",
        "Manufacturing details"
      ]
    },
    {
      name: "Make/Model/Year API",
      status: "active" as const,
      icon: Database,
      endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/",
      description: "Currently integrated - Get all models for a specific make",
      features: [
        "Vehicle makes list",
        "Model details",
        "Year ranges",
        "Vehicle type classification"
      ]
    },
    {
      name: "vPIC API",
      status: "active" as const,
      icon: Database,
      endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/",
      description: "Vehicle Product Information Catalog - Comprehensive vehicle data",
      features: [
        "Complete vehicle specifications",
        "Manufacturer details",
        "Vehicle types and categories",
        "Equipment data",
        "Plant information"
      ]
    },
    {
      name: "Recall Database API",
      status: "coming_soon" as const,
      icon: Shield,
      endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/recalls/",
      description: "Not yet integrated - Access vehicle recall information and safety notices",
      features: [
        "Active safety recalls",
        "Recall descriptions and remedies",
        "Affected components",
        "Manufacturer communications"
      ]
    },
    {
      name: "Safety Ratings API",
      status: "coming_soon" as const,
      icon: FileWarning,
      endpoint: "https://vpic.nhtsa.dot.gov/api/SafetyRatings/",
      description: "Get NHTSA crash test ratings and safety evaluations",
      features: [
        "Overall vehicle safety ratings",
        "Crash test results",
        "Safety feature evaluations",
        "Side impact assessments"
      ]
    },
    {
      name: "Technical Service Bulletins API",
      status: "coming_soon" as const,
      icon: Wrench,
      endpoint: "https://vpic.nhtsa.dot.gov/api/vehicles/tsbs/",
      description: "Access manufacturer service bulletins and technical notices",
      features: [
        "Service bulletins",
        "Technical notifications",
        "Repair procedures",
        "Known issues and fixes"
      ]
    }
  ];

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-6 border rounded-lg p-6 bg-muted/50">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">NHTSA API Integration Status</h3>
          <Badge variant="default">Connected</Badge>
        </div>
        
        <div className="divide-y">
          {apis.map((api) => (
            <ApiCard key={api.name} {...api} />
          ))}
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Currently integrated with VIN Decoder API, Make/Model/Year API, and vPIC API. Additional NHTSA APIs will be added in future updates.
            For technical documentation and API specifications, visit the NHTSA API documentation portal.
          </AlertDescription>
        </Alert>
      </div>
    </ScrollArea>
  );
};