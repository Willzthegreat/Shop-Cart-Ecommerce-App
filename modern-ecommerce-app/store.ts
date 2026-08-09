import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  delectCartProduct: (productId: string) => void;
  reseltCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupItems: () => CartItem[];
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
}

const getItemPrice = (product: Product) => {
  const price = Number(product.price) || 0;
  const originalPrice = Number(product.discount) || 0;

  return originalPrice > price ? price : price;
};

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],

      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return { items: [...state.items, { product, quantity: 1 }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product._id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),

      delectCartProduct: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        })),

      reseltCart: () => set({ items: [] }),

      getSubTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + getItemPrice(item.product) * item.quantity,
          0,
        ),

      getTotalPrice: () => get().getSubTotalPrice(),

      getItemCount: (productId) =>
        get().items.find((item) => item.product._id === productId)?.quantity || 0,

      getGroupItems: () => get().items,

      addToFavorite: async (product) => {
        set((state) =>
          state.favoriteProduct.some((item) => item._id === product._id)
            ? state
            : { favoriteProduct: [...state.favoriteProduct, product] },
        );
      },

      removeFromFavorite: (productId) =>
        set((state) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (product) => product._id !== productId,
          ),
        })),

      resetFavorite: () => set({ favoriteProduct: [] }),
    }),
    { name: "cart-store" },
  ),
);

export default useStore;
