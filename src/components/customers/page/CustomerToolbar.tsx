
import { FC, useState } from "react";
import { Download, Filter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Papa from "papaparse";
import { saveAs } from "file-saver";

interface CustomerToolbarProps {
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onBulkAction?: (action: string, selectedIds: string[]) => void;
  searchQuery: string;
  selectedCustomers?: string[];
}

export const CustomerToolbar: FC<CustomerToolbarProps> = ({
  onSearchChange,
  onFilterChange,
  onBulkAction,
  searchQuery,
  selectedCustomers = []
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      let query = supabase
        .from('customers')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone_number,
          customer_type,
          loyalty_tier,
          loyalty_points,
          total_spend,
          created_at
        `);

      // If there are selected customers, only export those
      if (selectedCustomers.length > 0) {
        query = query.in('id', selectedCustomers);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data for CSV export
      const csvData = data.map(customer => ({
        ID: customer.id,
        'First Name': customer.first_name,
        'Last Name': customer.last_name,
        Email: customer.email,
        'Phone Number': customer.phone_number,
        Type: customer.customer_type,
        'Loyalty Tier': customer.loyalty_tier,
        'Loyalty Points': customer.loyalty_points,
        'Total Spend': customer.total_spend,
        'Created At': new Date(customer.created_at).toLocaleDateString()
      }));

      // Convert to CSV
      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `customers_export_${new Date().toISOString().split('T')[0]}.csv`);

      toast.success(`Successfully exported ${data.length} customers`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export customers');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="flex gap-2">
        <Select onValueChange={onFilterChange} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="high_value">High Value</SelectItem>
            <SelectItem value="at_risk">At Risk</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting}
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>

        {selectedCustomers.length > 0 && onBulkAction && (
          <Select 
            onValueChange={(value) => onBulkAction(value, selectedCustomers)}
          >
            <SelectTrigger className="w-[180px]">
              <Users className="h-4 w-4 mr-2" />
              <span>Bulk Actions</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tag">Add Tag</SelectItem>
              <SelectItem value="segment">Add to Segment</SelectItem>
              <SelectItem value="status">Update Status</SelectItem>
              <SelectItem value="delete">Delete Selected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};
