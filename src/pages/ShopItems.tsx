
import { useAmazonProductSearch } from "@/hooks/integrations/useAmazonProductSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ShoppingCart, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

type ProductCategory = {
  id: string;
  name: string;
  keywords: string[];
  directLinks?: Array<{
    url: string;
    title?: string;
    description?: string;
  }>;
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
    keywords: ["automotive accessories", "misc automotive tools"],
    directLinks: [
      {
        url: "https://amzn.to/40INV6K",
        title: "Recommended Auto Accessories",
        description: "Browse our featured automotive accessories"
      }
    ]
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
      return result;
    } catch (error) {
      console.error("Error searching products:", error);
      toast.error("Failed to load products. Please try again later.");
    }
  };

  const handleDirectLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Shop Items</h1>
          <p className="text-muted-foreground">
            Browse recommended tools and equipment for your shop
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => handleDirectLinkClick('https://amzn.to/40INV6K')}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Search Amazon
        </Button>
      </div>

      <Tabs defaultValue={productCategories[0].id} className="space-y-6">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b pb-4">
          <TabsList className="h-auto flex flex-wrap gap-2 bg-transparent">
            {productCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="px-4 py-2 whitespace-normal text-center h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {productCategories.map((category) => (
          <TabsContent 
            key={category.id} 
            value={category.id} 
            className="space-y-6 mt-4"
          >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Display Direct Links if available */}
              {category.directLinks?.map((link, index) => (
                <Card key={`direct-${index}`} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{link.title || "Featured Product"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">
                      {link.description || "Click to view this recommended product"}
                    </p>
                    <Button 
                      onClick={() => handleDirectLinkClick(link.url)}
                      className="w-full"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Amazon
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Product Search Section */}
              {searchProducts.isPending ? (
                Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
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
                <Alert variant="destructive" className="col-span-full">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load products. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : (
                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>Products for {category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleSearch(category.keywords)}
                      className="w-full"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Load More Products
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
