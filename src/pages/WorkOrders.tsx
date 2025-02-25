
import { useState } from "react";
import { useWorkOrders } from "@/hooks/use-work-orders";
import { WorkOrderTable } from "@/components/work-orders/WorkOrderTable";
import { WorkOrderHeader } from "@/components/work-orders/WorkOrderHeader";
import { WorkOrderFilters } from "@/components/work-orders/WorkOrderFilters";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import { saveAs } from "file-saver";
import Papa from "papaparse";

export type WorkOrderFiltersType = {
  startDate?: Date;
  endDate?: Date;
  status?: string;
  customerId?: string | null;
};

export type SortConfig = {
  field: string;
  direction: 'asc' | 'desc';
};

export default function WorkOrders() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState<WorkOrderFiltersType>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'date', direction: 'desc' });
  
  const { workOrders, isLoading, updateWorkOrders, deleteWorkOrders } = useWorkOrders(filters, sortConfig);

  const handleBatchUpdate = async (status: string) => {
    try {
      await updateWorkOrders(selectedItems, { status });
      toast.success("Work orders updated successfully");
      setSelectedItems([]);
    } catch (error) {
      toast.error("Failed to update work orders");
    }
  };

  const handleBatchDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the selected work orders?")) {
      return;
    }

    try {
      await deleteWorkOrders(selectedItems);
      toast.success("Work orders deleted successfully");
      setSelectedItems([]);
    } catch (error) {
      toast.error("Failed to delete work orders");
    }
  };

  const handleExport = () => {
    const csv = Papa.unparse(workOrders.map(order => ({
      ID: order.id,
      Customer: order.customer,
      Vehicle: order.vehicle,
      Description: order.description,
      Status: order.status,
      Date: order.date
    })));
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `work-orders-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  const handlePrint = () => {
    // Open print template in new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const selectedOrders = selectedItems.length > 0 
      ? workOrders.filter(order => selectedItems.includes(order.id))
      : workOrders;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Work Orders</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .header { margin-bottom: 20px; }
            @media print {
              .no-print { display: none; }
              body { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Work Orders</h1>
            <p>Generated: ${format(new Date(), 'PPpp')}</p>
          </div>
          <button class="no-print" onclick="window.print()">Print</button>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${selectedOrders.map(order => `
                <tr>
                  <td>${order.id}</td>
                  <td>${order.customer}</td>
                  <td>${order.vehicle}</td>
                  <td>${order.description}</td>
                  <td>${order.status}</td>
                  <td>${order.date}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <WorkOrderHeader />
      
      <div className="flex flex-col gap-4">
        <WorkOrderFilters 
          onCustomerSelect={id => setFilters(prev => ({ ...prev, customerId: id }))}
          onDateChange={(start, end) => setFilters(prev => ({ ...prev, startDate: start, endDate: end }))}
          onStatusChange={status => setFilters(prev => ({ ...prev, status }))}
        />

        <div className="flex justify-between items-center">
          <div className="space-x-2">
            {selectedItems.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => handleBatchUpdate('completed')}
                >
                  Mark as Completed
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleBatchUpdate('cancelled')}
                >
                  Mark as Cancelled
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleBatchDelete}
                >
                  Delete Selected
                </Button>
              </>
            )}
          </div>
          
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={handleExport}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <WorkOrderTable 
          workOrders={workOrders} 
          isLoading={isLoading}
          selectedItems={selectedItems}
          onSelectItems={setSelectedItems}
          sortConfig={sortConfig}
          onSort={setSortConfig}
        />
      </div>
    </div>
  );
}
