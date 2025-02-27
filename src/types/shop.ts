
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'low' | 'outOfStock';
  image?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  keywords: string[];
  directLinks?: AffiliateLink[];
}

export interface AffiliateLink {
  url: string;
  asin?: string;
  title: string;
  description: string;
}

export interface FeaturedProduct {
  title: string;
  description: string;
  price?: string;
  image?: string;
  url: string;
}
