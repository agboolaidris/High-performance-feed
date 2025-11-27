// stores/cartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "@/types/product";

interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string; // New field for analytics
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// Migration function for future schema changes
const migrateCartStore = (persistedState: any, version: number) => {
  if (!persistedState) return undefined;

  // Version 0 -> 1: Add addedAt field to existing items
  if (version === 0) {
    return {
      ...persistedState,
      items: persistedState.items.map((item: any) => ({
        ...item,
        addedAt: item.addedAt || new Date().toISOString(),
      })),
    };
  }

  return persistedState;
};

export const useProductsCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          } else {
            return {
              items: [
                ...state.items,
                {
                  product,
                  quantity,
                  addedAt: new Date().toISOString(),
                },
              ],
            };
          }
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price =
            item.product.discountPercentage > 0
              ? item.product.price * (1 - item.product.discountPercentage / 100)
              : item.product.price;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: "cart-storage",
      version: 1, // Increment this when you make schema changes
      migrate: migrateCartStore,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      // Optional: Partial persistence (only persist specific fields)
      partialize: (state) => ({
        items: state.items,
        // Don't persist _hasHydrated
      }),
    }
  )
);
