
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample data - would be replaced with actual data from API
const demoShopItems = [
  { 
    id: "1", 
    name: "Oil Change Service", 
    category: "Service", 
    price: 49.99,
    stock: "Available",
    status: "active"
  },
  { 
    id: "2", 
    name: "Brake Fluid", 
    category: "Product", 
    price: 12.99,
    stock: "43 units",
    status: "active"
  },
  { 
    id: "3", 
    name: "Air Filter", 
    category: "Product", 
    price: 24.99,
    stock: "18 units",
    status: "active"
  },
  { 
    id: "4", 
    name: "Tire Rotation", 
    category: "Service", 
    price: 29.99,
    stock: "Available",
    status: "active"
  },
  { 
    id: "5", 
    name: "Wiper Blades", 
    category: "Product", 
    price: 15.99,
    stock: "27 units",
    status: "low"
  },
  { 
    id: "6", 
    name: "Engine Diagnostic", 
    category: "Service", 
    price: 89.99,
    stock: "Available",
    status: "active"
  }
];

export function ShopItemsList() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const shopItems = demoShopItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockBadgeVariant = (stock: string, status: string) => {
    if (stock === "Available") return "success";
    if (status === "low") return "warning";
    return "secondary";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="flex items-center gap-2 whitespace-nowrap">
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shopItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No items found.
                  </TableCell>
                </TableRow>
              ) : (
                shopItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant={item.category === "Service" ? "default" : "secondary"}>
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStockBadgeVariant(item.stock, item.status)}>
                        {item.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
