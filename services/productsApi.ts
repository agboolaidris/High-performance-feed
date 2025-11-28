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

    // 1. Determine the Base Path (Category takes precedence for cleaner filtering)
    const categorySpecified =
      filters.category && filters.category.toLowerCase() !== "all";

    if (categorySpecified) {
      // If category is specified, use the Category endpoint
      path = `/products/category/${filters.category}`;
    } else if (filters.q) {
      // If no specific category, but a search term is present, use the Search endpoint
      path = `/products/search`;
    }
    // Otherwise, path remains '/products' (get all)

    // 2. Add URL Parameters
    if (filters.limit) params.limit = filters.limit.toString();
    if (filters.skip) params.skip = filters.skip.toString();

    // NOTE: 'q' parameter is ONLY valid for the /products/search endpoint.
    if (filters.q && !categorySpecified) {
      params.q = filters.q;
    }

    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;

    // 3. Make the Request
    let response = await apiClient.get<ProductsResponse>(path, params);

    // 4. Client-Side Filtering (Necessary if both q and category were passed)
    if (categorySpecified && filters.q) {
      // The search term 'q' must be filtered client-side because the API cannot combine them.
      const lowerCaseQuery = filters.q.toLowerCase();

      response.products = response.products.filter(
        (product) =>
          product.title.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery)
      );
      // You would also need to update the 'total' and 'skip' counts if needed
    }

    return response;
  },
  // Get single product
  getProduct: async (id: string): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}`);
  },

  // Get categories
  getCategories: async (): Promise<ProductCategory[]> => {
    return apiClient.get<ProductCategory[]>("/products/categories");
  },
};
