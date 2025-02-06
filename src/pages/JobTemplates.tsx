
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JobTemplates() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Job Templates</h1>
      <Card>
        <CardHeader>
          <CardTitle>Templates Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Job templates will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
