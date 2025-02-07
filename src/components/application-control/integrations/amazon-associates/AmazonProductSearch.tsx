
import { useState } from "react";
import { useAmazonProductSearch } from "@/hooks/integrations/useAmazonProductSearch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Search } from "lucide-react";

export function AmazonProductSearch() {
  const [keywords, setKeywords] = useState("");
  const { searchProducts } = useAmazonProductSearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywords.trim()) return;
    
    searchProducts.mutate({ keywords });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search for products..."
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <Button type="submit" disabled={searchProducts.isPending}>
          {searchProducts.isPending ? (
            <LoadingSpinner className="h-4 w-4" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>

      {searchProducts.isPending && (
        <div className="flex justify-center">
          <LoadingSpinner className="h-8 w-8" />
        </div>
      )}

      {searchProducts.isError && (
        <div className="text-red-500 text-sm">
          Failed to search products. Please try again.
        </div>
      )}

      {searchProducts.data?.SearchResult?.Items && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {searchProducts.data.SearchResult.Items.map((item: any) => (
            <Card key={item.ASIN} className="p-4">
              {item.Images?.Primary?.Medium && (
                <img
                  src={item.Images.Primary.Medium.URL}
                  alt={item.ItemInfo.Title.DisplayValue}
                  className="w-full h-48 object-contain"
                />
              )}
              <h3 className="mt-2 font-medium">{item.ItemInfo.Title.DisplayValue}</h3>
              {item.Offers?.Listings?.[0]?.Price && (
                <p className="text-green-600 font-medium">
                  ${item.Offers.Listings[0].Price.Amount.toFixed(2)}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
