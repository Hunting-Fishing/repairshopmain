
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { parseJobTemplatesCsv } from "../utils/csvParser";

export const useJobTemplates = () => {
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
      return parseJobTemplatesCsv(text);
    },
  });
};

export { COLUMN_NAMES } from "../utils/csvParser";
