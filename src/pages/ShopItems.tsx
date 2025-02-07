
import { useAmazonProductSearch } from "@/hooks/integrations/useAmazonProductSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { productCategories } from "@/constants/productCategories";
import { CategoryContent } from "@/components/shop/CategoryContent";

export default function ShopItems() {
  const [activeCategory, setActiveCategory] = useState<string>(productCategories[0].id);
  const { searchProducts, searchProductByAsin } = useAmazonProductSearch();
  const [featuredProduct, setFeaturedProduct] = useState<any>(null);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);
  
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

  const loadFeaturedProduct = async (asin: string) => {
    try {
      setIsLoadingFeatured(true);
      const result = await searchProductByAsin.mutateAsync({ asin });
      if (result) {
        setFeaturedProduct(result);
      }
    } catch (error) {
      console.error("Error loading featured product:", error);
      toast.error("Failed to load featured product details.");
    } finally {
      setIsLoadingFeatured(false);
    }
  };

  useEffect(() => {
    const miscCategory = productCategories.find(cat => cat.id === "misc");
    const featuredAsin = miscCategory?.directLinks?.[0]?.asin;
    if (featuredAsin) {
      loadFeaturedProduct(featuredAsin);
    }
  }, []);

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
            <CategoryContent
              category={category}
              isPending={searchProducts.isPending}
              isError={searchProducts.isError}
              featuredProduct={featuredProduct}
              isLoadingFeatured={isLoadingFeatured}
              onSearch={handleSearch}
              onDirectLinkClick={handleDirectLinkClick}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
