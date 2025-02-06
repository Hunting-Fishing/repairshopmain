
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TablesList() {
  const { data: tables, isLoading } = useQuery({
    queryKey: ['database-tables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('*')
        .eq('table_schema', 'public');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Tables</CardTitle>
        <CardDescription>View all tables in the database</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">Loading tables...</TableCell>
                </TableRow>
              ) : tables?.map((table) => (
                <TableRow key={table.table_name}>
                  <TableCell>{table.table_name}</TableCell>
                  <TableCell>{table.table_type}</TableCell>
                  <TableCell>{table.self_referencing_column_name || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
