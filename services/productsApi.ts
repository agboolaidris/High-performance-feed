// services/productsApi.ts
import { apiClient } from "./apiClient";
import {
  Product,
  ProductCategory,
  ProductsResponse,
  ProductsParams,
} from "@/types/product";

export const productsApi = {
  // Get all products with filters
  getProducts: async (
    filters: ProductsParams = {}
  ): Promise<ProductsResponse> => {
    const params: Record<string, string> = {};
    let path = "/products";

    if (filters.category && filters.category.toLowerCase() !== "all") {
      path = `/products/category/${filters.category}`;
    }

    ({ path });
    if (filters.limit) params.limit = filters.limit.toString();
    if (filters.skip) params.skip = filters.skip.toString();
    if (filters.q) params.q = filters.q;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    return apiClient.get<ProductsResponse>(path, params);
  },

  // Get single product
  getProduct: async (id: string): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}`);
  },

  // Get categories
  getCategories: async (): Promise<ProductCategory[]> => {
    return apiClient.get<ProductCategory[]>("/products/categories");
  },

  //   // Get products by category
  //   getProductsByCategory: async (
  //     category: string
  //   ): Promise<ProductsResponse> => {
  //     return apiClient.get<ProductsResponse>(`/products/category/${category}`);
  //   },

  //   // Search products
  //   searchProducts: async (query: string): Promise<ProductsResponse> => {
  //     return apiClient.get<ProductsResponse>(
  //       `/products/search?q=${encodeURIComponent(query)}`
  //     );
  //   },
};
