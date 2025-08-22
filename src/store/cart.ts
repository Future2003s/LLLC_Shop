import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  productId?: string;
  variantId?: string | null;
  variantName?: string | null;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variantId?: string | null) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    variantId?: string | null
  ) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const idx = state.items.findIndex(
            (it) =>
              it.id === item.id &&
              (it.variantId || null) === (item.variantId || null)
          );
          if (idx >= 0) {
            const next = [...state.items];
            next[idx] = {
              ...next[idx],
              quantity: next[idx].quantity + item.quantity,
            };
            return { items: next };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (it) =>
              !(it.id === id && (it.variantId || null) === (variantId || null))
          ),
        })),
      updateQuantity: (id, quantity, variantId) =>
        set((state) => ({
          items: state.items.map((it) =>
            it.id === id && (it.variantId || null) === (variantId || null)
              ? { ...it, quantity: Math.max(1, quantity) }
              : it
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "app_cart_v2" }
  )
);
