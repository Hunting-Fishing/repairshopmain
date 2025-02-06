
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
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from('RTDATA')
        .download('Job List 1.csv');

      if (fileError) {
        console.error('Error fetching CSV file:', fileError);
        toast.error('Failed to load job templates');
        throw fileError;
      }

      const text = await fileData.text();
      
      return new Promise<Record<string, string[]>>((resolve, reject) => {
        parse(text, {
          header: false,
          complete: (results) => {
            const columns: Record<string, string[]> = {
              'MAIN': [],
              '*00': [],
              '*01': [],
              '*02': [],
              '*03': [],
              '*04': [],
              '*05': [],
              '*06': [],
              '*07': [],
              '*08': [],
              '*09': [],
              '*10': [],
              '*11': [],
              '*12': [],
              '*13': [],
              '*14': [],
              '*15': []
            };

            // Start from row 2 (index 1) and go up to row 50 or end of data
            const rows = results.data;
            const maxRow = Math.min(50, rows.length);

            for (let i = 1; i < maxRow; i++) {
              const row = rows[i] as string[];
              if (!row) continue;

              // Process each column
              row.forEach((value, colIndex) => {
                if (value && value.trim()) {
                  switch (colIndex) {
                    case 0:
                      columns['MAIN'].push(value.trim());
                      break;
                    case 1:
                      columns['*00'].push(value.trim());
                      break;
                    case 2:
                      columns['*01'].push(value.trim());
                      break;
                    case 3:
                      columns['*02'].push(value.trim());
                      break;
                    case 4:
                      columns['*03'].push(value.trim());
                      break;
                    case 5:
                      columns['*04'].push(value.trim());
                      break;
                    case 6:
                      columns['*05'].push(value.trim());
                      break;
                    case 7:
                      columns['*06'].push(value.trim());
                      break;
                    case 8:
                      columns['*07'].push(value.trim());
                      break;
                    case 9:
                      columns['*08'].push(value.trim());
                      break;
                    case 10:
                      columns['*09'].push(value.trim());
                      break;
                    case 11:
                      columns['*10'].push(value.trim());
                      break;
                    case 12:
                      columns['*11'].push(value.trim());
                      break;
                    case 13:
                      columns['*12'].push(value.trim());
                      break;
                    case 14:
                      columns['*13'].push(value.trim());
                      break;
                    case 15:
                      columns['*14'].push(value.trim());
                      break;
                    case 16:
                      columns['*15'].push(value.trim());
                      break;
                  }
                }
              });
            }
            
            resolve(columns);
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {templates && Object.entries(templates).map(([category, items]) => (
              <DropdownMenu key={category}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {category} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px] max-h-[300px] overflow-y-auto">
                  {Array.isArray(items) && items.map((item, index) => (
                    <DropdownMenuItem key={`${category}-${index}`}>
                      {item}
                    </DropdownMenuItem>
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
