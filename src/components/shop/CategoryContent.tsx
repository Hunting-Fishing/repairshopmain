
import { ProductCategory } from "@/types/shop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ProductLoadingCards, ProductError } from "./ProductLoadingStates";
import { FeaturedProductCard } from "./FeaturedProductCard";

interface CategoryContentProps {
  category: ProductCategory;
  isPending: boolean;
  isError: boolean;
  featuredProduct: any;
  isLoadingFeatured: boolean;
  onSearch: (keywords: string[]) => void;
  onDirectLinkClick: (url: string) => void;
}

export function CategoryContent({
  category,
  isPending,
  isError,
  featuredProduct,
  isLoadingFeatured,
  onSearch,
  onDirectLinkClick
}: CategoryContentProps) {
  if (isPending) {
    return <ProductLoadingCards />;
  }

  if (isError) {
    return <ProductError />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {category.id === "misc" && (
        <FeaturedProductCard
          product={featuredProduct}
          isLoading={isLoadingFeatured}
          onViewClick={onDirectLinkClick}
          url={category.directLinks?.[0]?.url || ""}
        />
      )}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Products for {category.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => onSearch(category.keywords)}
            className="w-full"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Load More Products
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
