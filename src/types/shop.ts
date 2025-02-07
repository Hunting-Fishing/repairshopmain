
export type ProductCategory = {
  id: string;
  name: string;
  keywords: string[];
  directLinks?: Array<{
    url: string;
    title?: string;
    description?: string;
    asin?: string;
  }>;
};

export type FeaturedProduct = {
  title: string;
  description?: string;
  image?: string;
  price?: string;
  url?: string;
}
