
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface WorkOrder {
  id: string;
  customer: string;
  vehicle: string;
  description: string;
  status: string;
  date: string;
  is_demo?: boolean;
}

interface WorkOrderTableProps {
  workOrders: WorkOrder[];
  isLoading: boolean;
}

export function WorkOrderTable({ workOrders, isLoading }: WorkOrderTableProps) {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const handleRowClick = (id: string) => {
    navigate(`/repair-jobs/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="rounded-md border dark:border-gray-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No work orders found
              </TableCell>
            </TableRow>
          ) : (
            workOrders.map((order) => (
              <TableRow 
                key={order.id}
                onClick={() => handleRowClick(order.id)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.vehicle}</TableCell>
                <TableCell>{order.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  {order.is_demo && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      Demo
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
