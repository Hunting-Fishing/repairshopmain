
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { parseJobTemplatesCsv } from "../utils/csvParser";

/**
 * Hook to fetch and parse job templates from a CSV file stored in Supabase Storage.
 * 
 * Data Source:
 * - Bucket: RTDATA (public bucket in Supabase Storage)
 * - File: Job List 1.csv (configured in system_configuration table)
 * - Format: CSV file containing job template categories and their items
 * 
 * Note: The file name is stored in the system_configuration table with the key 'job_templates_file'
 * to allow for easy updates without code changes.
 */
export const useJobTemplates = () => {
  return useQuery({
    queryKey: ['job-templates-csv'],
    queryFn: async () => {
      // First fetch the file name from system configuration
      const { data: configData, error: configError } = await supabase
        .from('system_configuration')
        .select('value')
        .eq('key', 'job_templates_file')
        .single();

      if (configError) {
        console.error('Error fetching configuration:', configError);
        toast.error('Failed to load job templates configuration');
        throw configError;
      }

      const fileName = configData.value;
      
      // Then fetch the actual CSV file from the RTDATA bucket in Supabase Storage
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from('RTDATA')
        .download(fileName);

      if (fileError) {
        console.error('Error fetching CSV file:', fileError);
        toast.error('Failed to load job templates');
        throw fileError;
      }

      const text = await fileData.text();
      return parseJobTemplatesCsv(text);
    },
  });
};

export { COLUMN_NAMES } from "../utils/csvParser";
