// hooks/useProducts.ts
import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { productsApi } from "@/services/productsApi";
import { ProductsParams } from "@/types/product";

// Query keys for cache management
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductsParams) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, "categories"] as const,
};

// Get all products with filters
export const useProducts = (filters: ProductsParams = {}) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsApi.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getProduct(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id, // Only run if id exists
  });
};

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: productsApi.getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes (categories don't change often)
  });
};

// Prefetch product
export const usePrefetchProduct = () => {
  const queryClient = useQueryClient();
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(id),
      queryFn: () => productsApi.getProduct(id),
    });
  };
};

// Infinite scroll for products
export const useInfiniteProducts = (
  filters: Omit<ProductsParams, "limit" | "skip"> = {}
) => {
  const limit = 20; // Products per page
  return useInfiniteQuery({
    queryKey: [...productKeys.list(filters), "infinite"],
    queryFn: ({ pageParam = 0 }) =>
      productsApi.getProducts({ ...filters, limit, skip: pageParam * limit }),
    getNextPageParam: (lastPage, allPages) => {
      const loadedItems = allPages.length * limit;
      return loadedItems < lastPage.total ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });
};
