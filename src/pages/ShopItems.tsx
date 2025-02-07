
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
    id: "diagnostics",
    name: "Adjust - Diagnose - Symptoms",
    keywords: ["automotive diagnostic tools", "diagnostic scanner", "code reader"]
  },
  {
    id: "maintenance",
    name: "Basic Maintenance",
    keywords: ["basic car maintenance tools", "oil change tools", "filter tools"]
  },
  {
    id: "brakes",
    name: "Brakes & Wheels",
    keywords: ["brake tools", "wheel tools", "brake service kit"]
  },
  {
    id: "cooling",
    name: "Cooling System & Belts",
    keywords: ["cooling system tools", "belt tools", "radiator service tools"]
  },
  {
    id: "computers",
    name: "Computers & Electronics",
    keywords: ["automotive computer tools", "electronic diagnostic tools"]
  },
  {
    id: "drivetrain",
    name: "Drive Train, Axles & Rear End",
    keywords: ["drivetrain tools", "axle tools", "differential tools"]
  },
  {
    id: "electrical",
    name: "Electrical & Lights",
    keywords: ["automotive electrical tools", "circuit tester", "electrical repair kit"]
  },
  {
    id: "engine",
    name: "Engine & Valve Train",
    keywords: ["engine tools", "valve train tools", "timing tools"]
  },
  {
    id: "exhaust",
    name: "Exhaust & Emissions",
    keywords: ["exhaust tools", "emissions tools", "exhaust repair kit"]
  },
  {
    id: "suspension",
    name: "Front End & Suspension",
    keywords: ["suspension tools", "front end tools", "strut tools"]
  },
  {
    id: "fuel",
    name: "Fuel System & Tune-Up",
    keywords: ["fuel system tools", "tune up tools", "fuel line tools"]
  },
  {
    id: "gaskets",
    name: "Gaskets & Seals",
    keywords: ["gasket tools", "seal tools", "gasket maker tools"]
  },
  {
    id: "hvac",
    name: "Heating & Air Conditioning",
    keywords: ["ac tools", "hvac tools", "ac service kit"]
  },
  {
    id: "misc",
    name: "Miscellaneous & Accessories",
    keywords: ["automotive accessories", "misc automotive tools"]
  },
  {
    id: "steering",
    name: "Steering Column & Gauges",
    keywords: ["steering tools", "gauge tools", "steering service tools"]
  },
  {
    id: "transmission",
    name: "Transmission & Trans-Axle",
    keywords: ["transmission tools", "trans-axle tools", "transmission service kit"]
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
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
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
