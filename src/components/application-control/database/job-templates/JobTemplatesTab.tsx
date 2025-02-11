
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { JobTemplateUploadSection } from "./JobTemplateUploadSection";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function JobTemplatesTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle>Job Templates Import</CardTitle>
            <CardDescription>Import job templates from JSON file</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <JobTemplateUploadSection />
        <Alert>
          <AlertTitle>Template Format Requirements</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>The JSON file should contain an array of templates with the following structure:</p>
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              {JSON.stringify({
                name: "Template Name",
                category: "maintenance|repair|diagnostic|inspection|custom",
                description: "Template description",
                estimated_hours: 2,
                parts_required: ["part1", "part2"],
                job_number: "optional",
                sub_tasks: ["task1", "task2"],
                timeline: { step1: "details" },
                status: "pending|in_progress|completed|cancelled"
              }, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
