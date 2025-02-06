
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { parse } from 'papaparse';
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

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
          header: false,
          complete: (results) => {
            const templates: JobTemplate[] = [];
            const rows = results.data;

            // Skip header row if present
            for (let i = 1; i < rows.length; i++) {
              const row = rows[i] as string[];
              if (!row[0]) continue; // Skip empty rows

              // Column A is MAIN category
              const mainCategory = row[0];
              
              // Add main category item
              templates.push({
                id: `main-${i}`,
                name: mainCategory,
                description: null,
                category: 'MAIN',
                subcategory: null,
                estimated_hours: 1,
                parts_required: [],
                is_active: true
              });

              // Column B (*00) is subcategory
              if (row[1]) {
                templates.push({
                  id: `sub-${i}`,
                  name: row[1],
                  description: null,
                  category: mainCategory,
                  subcategory: '*00',
                  estimated_hours: 1,
                  parts_required: [],
                  is_active: true
                });
              }

              // Add items from columns *01 to *15
              for (let j = 2; j < row.length; j++) {
                if (row[j]) {
                  templates.push({
                    id: `${i}-${j}`,
                    name: row[j],
                    description: null,
                    category: mainCategory,
                    subcategory: `*${String(j-1).padStart(2, '0')}`,
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

  // Group templates by category and subcategory
  const groupedTemplates = templates?.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = {};
    }
    if (template.subcategory) {
      if (!acc[template.category][template.subcategory]) {
        acc[template.category][template.subcategory] = [];
      }
      acc[template.category][template.subcategory].push(template);
    }
    return acc;
  }, {} as Record<string, Record<string, JobTemplate[]>>);

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
          <div className="flex flex-wrap gap-4">
            {groupedTemplates && Object.entries(groupedTemplates).map(([category, subcategories]) => (
              <DropdownMenu key={category}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[200px]">
                    {category} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  {Object.entries(subcategories).map(([subcategory, items]) => (
                    items.map((item) => (
                      <DropdownMenuItem key={item.id}>
                        {item.name}
                      </DropdownMenuItem>
                    ))
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
