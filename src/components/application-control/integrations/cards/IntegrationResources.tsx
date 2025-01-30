import { Button } from "@/components/ui/button";
import { ExternalLink, Info } from "lucide-react";

interface IntegrationResourcesProps {
  websiteUrl?: string;
  documentationUrl?: string;
}

export const IntegrationResources = ({ websiteUrl, documentationUrl }: IntegrationResourcesProps) => (
  <div className="flex flex-wrap gap-2">
    {websiteUrl && (
      <Button 
        variant="outline" 
        size="sm"
        className="gap-1.5"
        onClick={() => window.open(websiteUrl, '_blank')}
      >
        <ExternalLink className="w-4 h-4" />
        Visit Website
      </Button>
    )}
    {documentationUrl && (
      <Button 
        variant="outline" 
        size="sm"
        className="gap-1.5"
        onClick={() => window.open(documentationUrl, '_blank')}
      >
        <Info className="w-4 h-4" />
        Documentation
      </Button>
    )}
  </div>
);