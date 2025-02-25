
import { Search, Filter, Download, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomerForm } from "../CustomerForm";

interface CustomerToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onExport: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerToolbar({
  searchQuery,
  onSearchChange,
  onFilterChange,
  onExport,
  open,
  onOpenChange,
}: CustomerToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex-1 flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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
            <DropdownMenuItem onClick={() => onFilterChange("all")}>
              All Customers
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange("active")}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange("inactive")}>
              Inactive
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange("vip")}>
              VIP
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="icon" onClick={onExport}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <Dialog open={open} onOpenChange={onOpenChange}>
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
          <CustomerForm 
            onSuccess={() => onOpenChange(false)} 
            mode="create"
            customerId="new" // For new customers, we use a placeholder ID
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
