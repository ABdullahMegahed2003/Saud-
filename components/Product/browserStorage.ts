export const FAVORITES_KEY = "saudi-favorites";
export const CART_KEY = "saudi-cart";

export function readFavoriteIds(): number[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]") as number[];
}

export function saveFavoriteIds(ids: number[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("saudi-storage-change"));
}

export function readCart(): Record<string, number> {
  if (typeof window === "undefined") return {};
  return JSON.parse(localStorage.getItem(CART_KEY) || "{}") as Record<string, number>;
}

export function saveCart(cart: Record<string, number>) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("saudi-storage-change"));
}
