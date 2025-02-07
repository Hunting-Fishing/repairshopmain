
import { useAmazonProductSearch } from "@/hooks/integrations/useAmazonProductSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

type ProductCategory = {
  id: string;
  name: string;
  keywords: string[];
};

const productCategories: ProductCategory[] = [
  {
    id: "consumables",
    name: "Consumables",
    keywords: ["automotive consumables", "shop supplies", "maintenance supplies"]
  },
  {
    id: "hand_tools",
    name: "Hand Tools",
    keywords: ["automotive hand tools", "mechanic tools set"]
  },
  {
    id: "scanners",
    name: "Diagnostic Tools",
    keywords: ["automotive diagnostic scanner", "OBD2 scanner"]
  },
  {
    id: "specialty_tools",
    name: "Specialty Tools",
    keywords: ["automotive specialty tools", "mechanic specialty tools"]
  },
  {
    id: "safety",
    name: "Safety Equipment",
    keywords: ["automotive safety equipment", "mechanic safety gear"]
  }
];

export default function ShopItems() {
  const [activeCategory, setActiveCategory] = useState<string>(productCategories[0].id);
  const { searchProducts } = useAmazonProductSearch();
  
  const handleSearch = async (keywords: string[]) => {
    try {
      const result = await searchProducts.mutateAsync({ keywords: keywords.join(" ") });
      console.log("Search results:", result);
      // TODO: Handle the results display
      return result;
    } catch (error) {
      console.error("Error searching products:", error);
      toast.error("Failed to load products. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shop Items</h1>
          <p className="text-muted-foreground">
            Browse recommended tools and equipment for your shop
          </p>
        </div>
      </div>

      <Tabs defaultValue={productCategories[0].id} className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2">
          {productCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              onClick={() => setActiveCategory(category.id)}
              className="text-sm"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {productCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchProducts.isPending ? (
                Array(6).fill(0).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-[200px] w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mt-2" />
                    </CardContent>
                  </Card>
                ))
              ) : searchProducts.isError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load products. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleSearch(category.keywords)}
                      className="w-full"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Load Products
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
