
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { parse } from 'papaparse';
import { toast } from "sonner";

interface JobTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  estimated_hours: number | null;
  parts_required: any[];
  is_active: boolean;
}

export default function JobTemplates() {
  const { data: templates, isLoading } = useQuery({
    queryKey: ['job-templates-csv'],
    queryFn: async () => {
      // First get the CSV file from storage
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from('RTDATA')
        .download('Job List 1.csv');

      if (fileError) {
        console.error('Error fetching CSV file:', fileError);
        toast.error('Failed to load job templates');
        throw fileError;
      }

      // Convert the blob to text
      const text = await fileData.text();
      
      // Parse CSV
      return new Promise<JobTemplate[]>((resolve, reject) => {
        parse(text, {
          header: false, // Changed to false since we're handling columns manually
          complete: (results) => {
            const templates: JobTemplate[] = [];
            const rows = results.data;

            // Skip header row if present
            for (let i = 1; i < rows.length; i++) {
              const row = rows[i] as string[];
              if (!row[0]) continue; // Skip empty rows

              // Column A is MAIN category, Column B (*00) is subcategory
              templates.push({
                id: i.toString(),
                name: row[0] || 'Unnamed Template',
                description: row[1] || null,
                category: 'MAIN',
                subcategory: row[1] || null, // *00 column
                estimated_hours: 1, // Default to 1 hour if not specified
                parts_required: [],
                is_active: true
              });

              // Add subcategories (columns *01 to *15) if they exist
              for (let j = 2; j < row.length; j++) {
                if (row[j]) {
                  templates.push({
                    id: `${i}-${j}`,
                    name: row[j],
                    description: null,
                    category: row[0], // Parent category
                    subcategory: row[1], // *00 as subcategory
                    estimated_hours: 1,
                    parts_required: [],
                    is_active: true
                  });
                }
              }
            }
            resolve(templates);
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
            toast.error('Failed to parse job templates');
            reject(error);
          }
        });
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Job Templates</h1>
        <Card>
          <CardHeader>
            <CardTitle>Templates Library</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Job Templates</h1>
      <Card>
        <CardHeader>
          <CardTitle>Templates Library</CardTitle>
        </CardHeader>
        <CardContent>
          {templates?.length === 0 ? (
            <p className="text-muted-foreground">No job templates found.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates?.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Category:</span>
                      <span className="capitalize">{template.category.toLowerCase()}</span>
                    </div>
                    {template.subcategory && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Subcategory:</span>
                        <span className="capitalize">{template.subcategory}</span>
                      </div>
                    )}
                    {template.estimated_hours && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Estimated Hours:</span>
                        <span>{template.estimated_hours}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
