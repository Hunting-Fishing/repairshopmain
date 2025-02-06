
import { parse } from 'papaparse';
import { toast } from "sonner";

export const COLUMN_NAMES = {
  'A': 'Main Tasks',
  'B': 'Basic Services', 
  'C': 'Engine Services',
  'D': 'Transmission Services',
  'E': 'Brake Services',
  'F': 'Suspension Services',
  'G': 'Electrical Services',
  'H': 'HVAC Services',
  'I': 'Exhaust Services',
  'J': 'Steering Services',
  'K': 'Tire Services',
  'L': 'Body Services',
  'M': 'Diagnostic Services',
  'N': 'Maintenance Services',
  'O': 'Performance Services',
  'P': 'Safety Services',
  'Q': 'Miscellaneous Services'
};

export const parseJobTemplatesCsv = (csvText: string): Promise<Record<string, string[]>> => {
  return new Promise((resolve, reject) => {
    parse(csvText, {
      header: false,
      complete: (results) => {
        const columns: Record<string, string[]> = {};
        
        // Get header row (row 1) for category names
        const headerRow = results.data[0] as string[];
        if (!headerRow) {
          toast.error('Invalid CSV format: Missing header row');
          reject(new Error('Invalid CSV format'));
          return;
        }

        // Initialize columns with empty arrays
        headerRow.forEach((header, index) => {
          if (header && header.trim()) {
            const columnKey = String.fromCharCode(65 + index); // Convert 0-16 to A-Q
            columns[columnKey] = [];
          }
        });

        // Process rows 2-100
        const rows = results.data;
        const maxRow = Math.min(100, rows.length);

        for (let i = 1; i < maxRow; i++) {
          const row = rows[i] as string[];
          if (!row) continue;

          row.forEach((value, colIndex) => {
            if (value && value.trim()) {
              const columnKey = String.fromCharCode(65 + colIndex); // Convert 0-16 to A-Q
              if (columns[columnKey]) {
                columns[columnKey].push(value.trim());
              }
            }
          });
        }

        // Filter out empty columns
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
};
