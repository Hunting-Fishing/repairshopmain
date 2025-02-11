
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobTemplate } from "@/types/job-templates";
import { Clock, Tool, Package } from "lucide-react";

interface TemplatePreviewProps {
  template: JobTemplate;
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
        <p className="text-muted-foreground">{template.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4" />
              <h4 className="font-medium">Duration</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Estimated Time:</span>
                <Badge variant="secondary">
                  {template.estimated_duration_range.min}-{template.estimated_duration_range.max} min
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Tool className="h-4 w-4" />
              <h4 className="font-medium">Required Tools</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {template.required_tools.map((tool) => (
                <Badge key={tool} variant="outline">{tool}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4" />
              <h4 className="font-medium">Typical Parts</h4>
            </div>
            <div className="space-y-2">
              {template.typical_parts.map((part, index) => (
                <div key={index} className="flex justify-between">
                  <span>{part.name}</span>
                  <Badge variant="outline">x{part.quantity}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {template.required_certifications.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-4">Required Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {template.required_certifications.map((cert) => (
                  <Badge key={cert} variant="secondary">{cert}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
