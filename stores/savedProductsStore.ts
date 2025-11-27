// stores/favoritesStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types/product";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoriteItem {
  product: Product;
  addedAt: string;
}

interface FavoritesStore {
  // State
  favorites: FavoriteItem[];

  // Actions
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: number) => void;
  toggleFavorite: (product: Product) => void;
  clearFavorites: () => void;
  reorderFavorites: (productIds: number[]) => void;

  // Getters
  isFavorite: (productId: number) => boolean;
  getFavoritesCount: () => number;
  getFavorites: () => Product[];
  getRecentlyAdded: (limit?: number) => Product[];
}

export const useSavedProductstore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      favorites: [],

      // Add product to favorites with timestamp
      addToFavorites: (product: Product) => {
        set((state) => {
          // Check if product already exists
          const exists = state.favorites.some(
            (fav) => fav.product.id === product.id
          );
          if (exists) {
            return state;
          }

          const newFavorite: FavoriteItem = {
            product,
            addedAt: new Date().toISOString(),
          };

          return {
            favorites: [newFavorite, ...state.favorites], // Add to beginning
          };
        });
      },

      // Remove product from favorites
      removeFromFavorites: (productId: number) => {
        set((state) => ({
          favorites: state.favorites.filter(
            (fav) => fav.product.id !== productId
          ),
        }));
      },

      // Toggle favorite status
      toggleFavorite: (product: Product) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();

        if (isFavorite(product.id)) {
          removeFromFavorites(product.id);
        } else {
          addToFavorites(product);
        }
      },

      // Clear all favorites
      clearFavorites: () => {
        set({ favorites: [] });
      },

      // Reorder favorites (for manual sorting)
      reorderFavorites: (productIds: number[]) => {
        set((state) => {
          const favoritesMap = new Map(
            state.favorites.map((fav) => [fav.product.id, fav])
          );

          const reorderedFavorites = productIds
            .map((id) => favoritesMap.get(id))
            .filter(Boolean) as FavoriteItem[];

          return {
            favorites: reorderedFavorites,
          };
        });
      },

      // Check if product is favorite
      isFavorite: (productId: number) => {
        return get().favorites.some((fav) => fav.product.id === productId);
      },

      // Get total favorites count
      getFavoritesCount: () => {
        return get().favorites.length;
      },

      // Get just the products (without metadata)
      getFavorites: () => {
        return get().favorites.map((fav) => fav.product);
      },

      // Get recently added favorites
      getRecentlyAdded: (limit: number = 5) => {
        const favorites = get().favorites;
        return favorites
          .sort(
            (a, b) =>
              new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
          )
          .slice(0, limit)
          .map((fav) => fav.product);
      },
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      // Optional: Add migration if you ever change the store structure
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migrate from version 0 to 1 if needed
          return persistedState;
        }
        return persistedState;
      },
    }
  )
);
