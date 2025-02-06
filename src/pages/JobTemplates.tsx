
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
                  if (colIndex === 0) {
                    columns['MAIN'].push(value.trim());
                  } else if (colIndex === 1) {
                    columns['*00'].push(value.trim());
                  } else if (colIndex >= 2 && colIndex <= 16) {
                    // Columns C through Q map to *01 through *15
                    const key = `*${String(colIndex - 1).padStart(2, '0')}`;
                    columns[key].push(value.trim());
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
          <div className="flex flex-wrap gap-4">
            {templates && Object.entries(templates).map(([category, items]) => (
              <DropdownMenu key={category}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[200px]">
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
