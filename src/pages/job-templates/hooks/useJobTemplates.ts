
import { useQuery } from "@tanstack/react-query";
import { parse } from 'papaparse';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const COLUMN_NAMES = {
  'MAIN': 'Main Tasks',
  '*00': 'Basic Services',
  '*01': 'Engine Services',
  '*02': 'Transmission Services',
  '*03': 'Brake Services',
  '*04': 'Suspension Services',
  '*05': 'Electrical Services',
  '*06': 'HVAC Services',
  '*07': 'Exhaust Services',
  '*08': 'Steering Services',
  '*09': 'Tire Services',
  '*10': 'Body Services',
  '*11': 'Diagnostic Services',
  '*12': 'Maintenance Services',
  '*13': 'Performance Services',
  '*14': 'Safety Services',
  '*15': 'Miscellaneous Services'
};

export function useJobTemplates() {
  return useQuery({
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

            const rows = results.data;
            const maxRow = Math.min(50, rows.length);

            for (let i = 1; i < maxRow; i++) {
              const row = rows[i] as string[];
              if (!row) continue;

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

            const filteredColumns = Object.fromEntries(
              Object.entries(columns).filter(([_, items]) => items.length > 0)
            );
            
            resolve(filteredColumns);
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
}
