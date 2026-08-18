import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface UserProfile {
  items: CartItem[];
  favoriteProduct: Product[];
}

interface StoreState {
  activeUserKey: string;
  profiles: Record<string, UserProfile>;
  items: CartItem[];
  favoriteProduct: Product[];
  switchUser: (userKey?: string | null) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  delectCartProduct: (productId: string) => void;
  reseltCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupItems: () => CartItem[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
}

const GUEST_USER_KEY = "guest";

const getStoredUserKey = () => {
  if (typeof window === "undefined") return GUEST_USER_KEY;

  try {
    const user = JSON.parse(localStorage.getItem("user") || "null") as {
      id?: string;
      email?: string;
    } | null;
    return user?.id || user?.email || GUEST_USER_KEY;
  } catch {
    return GUEST_USER_KEY;
  }
};

const emptyProfile = (): UserProfile => ({ items: [], favoriteProduct: [] });

const getItemPrice = (product: Product) => Number(product.price) || 0;

const updateProfile = (
  state: StoreState,
  items: CartItem[],
  favoriteProduct = state.favoriteProduct,
) => ({
  items,
  favoriteProduct,
  profiles: {
    ...state.profiles,
    [state.activeUserKey]: { items, favoriteProduct },
  },
});

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      activeUserKey: getStoredUserKey(),
      profiles: {},
      items: [],
      favoriteProduct: [],

      switchUser: (userKey) =>
        set((state) => {
          const nextUserKey = userKey || GUEST_USER_KEY;
          const currentProfile = state.profiles[state.activeUserKey] || {
            items: state.items,
            favoriteProduct: state.favoriteProduct,
          };
          const savedProfile = state.profiles[nextUserKey] || emptyProfile();

          // Keep products added while signed out when the guest becomes logged in.
          const shouldMergeGuest =
            state.activeUserKey === GUEST_USER_KEY && nextUserKey !== GUEST_USER_KEY;
          const guestItems = shouldMergeGuest ? currentProfile.items : [];
          const guestFavorites = shouldMergeGuest
            ? currentProfile.favoriteProduct
            : [];

          const items = savedProfile.items.map((savedItem) => ({ ...savedItem }));
          for (const guestItem of guestItems) {
            const existingItem = items.find(
              (item) => item.product._id === guestItem.product._id,
            );

            if (existingItem) {
              const stock = Number(existingItem.product.stock);
              const mergedQuantity = existingItem.quantity + guestItem.quantity;
              existingItem.quantity = Number.isFinite(stock) && stock > 0
                ? Math.min(mergedQuantity, stock)
                : mergedQuantity;
            } else {
              items.push(guestItem);
            }
          }

          const favoriteProduct = [...savedProfile.favoriteProduct];
          for (const guestProduct of guestFavorites) {
            if (!favoriteProduct.some((item) => item._id === guestProduct._id)) {
              favoriteProduct.push(guestProduct);
            }
          }

          const profiles = {
            ...state.profiles,
            [nextUserKey]: { items, favoriteProduct },
          };

          if (shouldMergeGuest) {
            profiles[GUEST_USER_KEY] = emptyProfile();
          }

          return {
            activeUserKey: nextUserKey,
            profiles,
            items,
            favoriteProduct,
          };
        }),

      addItem: (product) =>
        set((state) => {
          const stock = Number(product.stock);
          const existingItem = state.items.find(
            (item) => item.product._id === product._id,
          );

          if (Number.isFinite(stock) && stock <= 0) return state;
          if (existingItem && Number.isFinite(stock) && existingItem.quantity >= stock) {
            return state;
          }

          const items = existingItem
            ? state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: Number(item.quantity) + 1 }
                  : item,
              )
            : [...state.items, { product, quantity: 1 }];

          return updateProfile(state, items);
        }),

      removeItem: (productId) =>
        set((state) => {
          const items = state.items
            .map((item) =>
              item.product._id === productId
                ? { ...item, quantity: Number(item.quantity) - 1 }
                : item,
            )
            .filter((item) => item.quantity > 0);
          return updateProfile(state, items);
        }),

      delectCartProduct: (productId) =>
        set((state) =>
          updateProfile(
            state,
            state.items.filter((item) => item.product._id !== productId),
          ),
        ),

      reseltCart: () =>
        set((state) => updateProfile(state, [])),

      getSubTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + getItemPrice(item.product) * item.quantity,
          0,
        ),

      getTotalPrice: () => get().getSubTotalPrice(),

      getItemCount: (productId) =>
        Number(get().items.find((item) => item.product._id === productId)?.quantity) || 0,

      getGroupItems: () => get().items,

      addToFavorite: async (product) => {
        set((state) => {
          if (state.favoriteProduct.some((item) => item._id === product._id)) {
            return state;
          }
          return updateProfile(state, state.items, [...state.favoriteProduct, product]);
        });
      },

      removeFromFavorite: (productId) =>
        set((state) =>
          updateProfile(
            state,
            state.items,
            state.favoriteProduct.filter((product) => product._id !== productId),
          ),
        ),

      resetFavorite: () =>
        set((state) => updateProfile(state, state.items, [])),
    }),
    {
      name: "cart-store-by-user",
      partialize: (state) => ({
        activeUserKey: state.activeUserKey,
        profiles: state.profiles,
      }),
    },
  ),
);

export { GUEST_USER_KEY };
export default useStore;
