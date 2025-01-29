import { UserSquare2, Search, Filter, Download, Edit, Trash2, UserPlus, Settings2 } from "lucide-react";
import { CustomerSettings } from "@/components/customers/CustomerSettings";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CustomerManagement() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers", searchQuery, filterStatus],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user.id) return [];

      let query = supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleNavigateToControl = () => {
    navigate("/customer-management");
  };

  const handleExport = () => {
    if (!customers?.length) {
      toast({
        title: "No data to export",
        description: "There are no customers matching your current filters.",
        variant: "destructive",
      });
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," + 
      "First Name,Last Name,Email,Phone,Address\n" +
      customers.map(c => 
        `${c.first_name},${c.last_name},${c.email},${c.phone_number},"${c.street_address}, ${c.city}, ${c.state_province}"`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: "Customer data has been exported to CSV.",
    });
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", customerId);

      if (error) throw error;

      toast({
        title: "Customer deleted",
        description: "The customer has been successfully removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting customer",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <UserSquare2 className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
            <p className="text-muted-foreground">
              Configure customer-related settings and view analytics
            </p>
          </div>
        </div>
        <Button onClick={handleNavigateToControl} variant="outline">
          <Settings2 className="h-4 w-4 mr-2" />
          Control Settings
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All Customers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("vip")}>
                VIP
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : customers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              customers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    {customer.first_name} {customer.last_name}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell>
                    {customer.city}, {customer.state_province}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.loyalty_tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                      customer.loyalty_tier === 'silver' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {customer.loyalty_tier}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <CustomerSettings />
    </div>
  );
}
