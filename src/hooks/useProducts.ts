import useSWR from "swr";

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  featured?: boolean;
  visible?: boolean;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-asc" | "price-desc" | "newest" | "oldest" | "default";
  limit?: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useProducts(filters: ProductFilters = {}) {
  // Build query string from filters
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const queryString = queryParams.toString();
  const url = `/api/products${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    products: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

// Example usage:
/*
import { useProducts } from '@/hooks/useProducts';

function ProductList() {
  const { products, isLoading, isError } = useProducts({
    category: 'formal-wear',
    size: 'L',
    sort: 'price-asc',
    limit: 10
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
*/
