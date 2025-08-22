"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAppContextProvider } from "@/context/app-context";

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

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variantId?: string | null) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    variantId?: string | null
  ) => void;
  clear: () => void;
  totalQuantity: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "app_cart_v1";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { sessionToken } = useAppContextProvider();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && raw.trim() !== "") {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (error) {
      console.error("Error parsing cart data from localStorage:", error);
      // Clear invalid data
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  // Sync cart with server when logged in
  useEffect(() => {
    const sync = async () => {
      if (!sessionToken) return;
      try {
        // Pull server cart
        const res = await fetch(`/api/cart`, {
          headers: { Authorization: `Bearer ${sessionToken}` },
          cache: "no-store",
        });
        if (res.ok) {
          const text = await res.text();
          const payload = text ? JSON.parse(text) : null;
          const serverItems: any[] =
            payload?.data?.items || payload?.items || [];
          if (Array.isArray(serverItems) && serverItems.length > 0) {
            const mapped: CartItem[] = serverItems.map((it: any) => ({
              id: it.id || it.sku || it.productId,
              name: it.name || it.productName,
              price: Number(it.price || it.unitPrice || 0),
              quantity: Number(it.quantity || 1),
              imageUrl: it.imageUrl || it.thumbnail,
              productId: it.productId || it.id,
              variantId: it.variantId ?? null,
              variantName: it.variantName ?? null,
            }));
            setItems(mapped);
            return;
          }
        }
        // If server empty, push local items
        if (items.length > 0) {
          await Promise.all(
            items.map((it) =>
              fetch(`/api/cart`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json; charset=utf-8",
                  Authorization: `Bearer ${sessionToken}`,
                },
                body: JSON.stringify({
                  productId: it.productId || it.id,
                  quantity: it.quantity,
                  variantId: it.variantId,
                }),
              })
            )
          );
        }
      } catch {}
    };
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionToken]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (it) =>
          it.id === item.id &&
          (it.variantId || null) === (item.variantId || null)
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + item.quantity,
        };
        // push server update if logged in
        if (sessionToken) {
          fetch(`/api/cart`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              Authorization: `Bearer ${sessionToken}`,
            },
            body: JSON.stringify({
              itemId: next[idx].id,
              productId: next[idx].productId || next[idx].id,
              variantId: next[idx].variantId,
              quantity: next[idx].quantity,
            }),
          }).catch(() => {});
        }
        return next;
      }
      const next = [...prev, item];
      if (sessionToken) {
        fetch(`/api/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            productId: item.productId || item.id,
            variantId: item.variantId,
            quantity: item.quantity,
          }),
        }).catch(() => {});
      }
      return next;
    });
  };

  const removeItem = (id: string, variantId?: string | null) => {
    setItems((prev) => {
      const next = prev.filter(
        (it) =>
          !(it.id === id && (it.variantId || null) === (variantId || null))
      );
      if (sessionToken) {
        fetch(`/api/cart`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ itemId: id, variantId }),
        }).catch(() => {});
      }
      return next;
    });
  };

  const updateQuantity = (
    id: string,
    quantity: number,
    variantId?: string | null
  ) => {
    setItems((prev) => {
      const next = prev.map((it) =>
        it.id === id && (it.variantId || null) === (variantId || null)
          ? { ...it, quantity: Math.max(1, quantity) }
          : it
      );
      if (sessionToken) {
        const target = next.find(
          (it) => it.id === id && (it.variantId || null) === (variantId || null)
        );
        if (target) {
          fetch(`/api/cart`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              Authorization: `Bearer ${sessionToken}`,
            },
            body: JSON.stringify({
              itemId: target.id,
              productId: target.productId || target.id,
              variantId: target.variantId,
              quantity: target.quantity,
            }),
          }).catch(() => {});
        }
      }
      return next;
    });
  };

  const clear = () => setItems([]);

  const { totalQuantity, totalPrice } = useMemo(() => {
    const tq = items.reduce((s, it) => s + it.quantity, 0);
    const tp = items.reduce((s, it) => s + it.quantity * it.price, 0);
    return { totalQuantity: tq, totalPrice: tp };
  }, [items]);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    totalQuantity,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
