
import { FeaturedProduct } from "@/types/shop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedProductCardProps {
  product: FeaturedProduct | null;
  isLoading: boolean;
  onViewClick: (url: string) => void;
  url: string;
}

export function FeaturedProductCard({ product, isLoading, onViewClick, url }: FeaturedProductCardProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </CardContent>
      </Card>
    );
  }

  if (!product) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{product.title || "Featured Product"}</CardTitle>
        {product.image && (
          <div className="aspect-square overflow-hidden rounded-lg">
            <img 
              src={product.image} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          {product.description}
        </p>
        {product.price && (
          <p className="text-lg font-bold">
            Price: {product.price}
          </p>
        )}
        <Button 
          onClick={() => onViewClick(product.url || url)}
          className="w-full"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Amazon
        </Button>
      </CardContent>
    </Card>
  );
}
