
import { useState, useEffect } from "react";
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
import { Plus, Edit, Trash2, Search, ExternalLink, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Amazon affiliate product categories with example products
const amazonCategories = [
  {
    id: "diagnostics",
    name: "Diagnostic Tools",
    products: [
      {
        title: "OBD2 Scanner",
        description: "Professional OBD2 Scanner for all vehicles",
        price: "$79.99",
        image: "https://images.unsplash.com/photo-1600880200963-11a8ee5f2b3f?q=80&w=250&auto=format&fit=crop",
        url: "https://www.amazon.com/dp/B07FTHCRFT"
      },
      {
        title: "Multimeter",
        description: "Digital Automotive Multimeter Kit",
        price: "$49.99",
        image: "https://images.unsplash.com/photo-1654615711647-2b860fa89320?q=80&w=250&auto=format&fit=crop",
        url: "https://www.amazon.com/dp/B01ISAMUA6"
      }
    ]
  },
  {
    id: "tools",
    name: "Hand Tools",
    products: [
      {
        title: "Mechanic Tool Set",
        description: "201-Piece Mechanic's Tool Kit with Case",
        price: "$129.99",
        image: "https://images.unsplash.com/photo-1567361808960-dec9cb578182?q=80&w=250&auto=format&fit=crop",
        url: "https://www.amazon.com/dp/B08DGCX386"
      },
      {
        title: "Torque Wrench",
        description: "1/2-Inch Drive Click Torque Wrench",
        price: "$59.99",
        image: "https://images.unsplash.com/photo-1535557597501-0fee0a500c57?q=80&w=250&auto=format&fit=crop",
        url: "https://www.amazon.com/dp/B07XP458JZ"
      }
    ]
  },
  {
    id: "fluids",
    name: "Fluids & Chemicals",
    products: [
      {
        title: "Synthetic Oil",
        description: "Full Synthetic Motor Oil, 5 Quart",
        price: "$26.99",
        image: "https://images.unsplash.com/photo-1635125520310-88e58a830c96?q=80&w=250&auto=format&fit=crop",
        url: "https://www.amazon.com/dp/B07CJHQSCT"
      },
      {
        title: "Brake Cleaner",
        description: "Non-Chlorinated Brake Parts Cleaner, 14 oz",
        price: "$6.99",
        image: "https://images.unsplash.com/photo-1657997918166-53c027be8c5b?q=80&w=250&auto=format&fit=crop",
        url: "https://www.amazon.com/dp/B000BXKZUG"
      }
    ]
  }
];

export function ShopItemsList() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const shopItems = demoShopItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [activeTab, setActiveTab] = useState("inventory");

  const getStockBadgeVariant = (stock: string, status: string) => {
    if (stock === "Available") return "success";
    if (status === "low") return "warning";
    return "secondary";
  };
  
  const handleExternalLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="inventory" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Shop Inventory</TabsTrigger>
          <TabsTrigger value="affiliate">Amazon Affiliate Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
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
        </TabsContent>
        
        <TabsContent value="affiliate">
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Affiliate Product Categories</h3>
              <Badge variant="outline" className="flex items-center gap-1">
                <ShoppingBag className="h-3 w-3" />
                <span>Amazon Associates</span>
              </Badge>
            </div>
            
            {amazonCategories.map((category) => (
              <div key={category.id} className="space-y-4">
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.products.map((product, index) => (
                    <Card key={`${category.id}-${index}`} className="overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        {product.image && (
                          <div className="w-full sm:w-1/3">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-40 sm:h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="w-full sm:w-2/3 p-4">
                          <h4 className="font-bold">{product.title}</h4>
                          <p className="text-muted-foreground text-sm my-2">{product.description}</p>
                          <p className="font-semibold mb-3">{product.price}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() => handleExternalLinkClick(product.url)}
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>View on Amazon</span>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="text-xs text-muted-foreground mt-6">
              <p>As an Amazon Associate, we earn from qualifying purchases.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
