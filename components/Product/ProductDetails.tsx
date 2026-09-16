"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { FiHeart, FiMinus, FiPlus, FiShoppingBag, FiTruck } from "react-icons/fi";
import { readFavoriteIds, readCart, saveCart, saveFavoriteIds } from "./browserStorage";
type ProductDetailsProps = {
  productId: number;
  isAvailable: boolean;
};

function playAddToCartSound() {
  const AudioContextClass = window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(1320, audioContext.currentTime + 0.07);
  oscillator.frequency.setValueAtTime(1760, audioContext.currentTime + 0.14);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.14, audioContext.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.28);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.28);
  oscillator.addEventListener("ended", () => void audioContext.close(), { once: true });
}

export default function ProductDetails({ productId, isAvailable }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [flyPosition, setFlyPosition] = useState<{ left: number; top: number; x: number; y: number } | null>(null);

  return (
    <>
      <div className="mt-8 grid gap-3 border-y border-slate-100 py-5 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FiTruck className="text-lg text-green-800" /> شحن آمن لباب البيت
        </div>
        <div className="text-sm text-slate-500">جودة سعودية مختارة</div>
        <div className="text-sm text-slate-500">متابعة بعد الطلب</div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold text-slate-500">الكمية:</span>
        <div className="flex items-center overflow-hidden rounded-full border border-green-900/20 bg-white">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="تقليل الكمية"
            className="flex h-10 w-10 items-center justify-center text-green-900 transition hover:bg-green-50"
          >
            <FiMinus />
          </button>
          <span className="flex h-10 min-w-10 items-center justify-center border-x border-green-900/10 font-bold text-green-950">
            {quantity.toLocaleString("ar-EG")}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => value + 1)}
            aria-label="زيادة الكمية"
            className="flex h-10 w-10 items-center justify-center text-green-900 transition hover:bg-green-50"
          >
            <FiPlus />
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            const nextValue = !isFavorite;
            const favoriteIds = readFavoriteIds().filter((id) => id !== productId);
            if (nextValue) favoriteIds.push(productId);
            saveFavoriteIds(favoriteIds);
            setIsFavorite(nextValue);
          }}
          aria-label={isFavorite ? "إزالة المنتج من المفضلة" : "إضافة المنتج إلى المفضلة"}
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
            isFavorite
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-600"
          }`}
        >
          <FiHeart className={isFavorite ? "fill-current" : ""} />
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={(event) => {
            const cart = readCart();
            cart[String(productId)] = (cart[String(productId)] || 0) + quantity;
            saveCart(cart);
            playAddToCartSound();
            setQuantity(1);
            setIsAdded(true);

            const source = document.querySelector<HTMLElement>("[data-product-image]") || event.currentTarget;
            const target = document.querySelector<HTMLElement>("[data-cart-icon]");
            const sourceRect = source.getBoundingClientRect();
            const targetRect = target?.getBoundingClientRect();
            const sourceCenterX = sourceRect.left + sourceRect.width / 2;
            const sourceCenterY = sourceRect.top + sourceRect.height / 2;
            const targetCenterX = targetRect ? targetRect.left + targetRect.width / 2 : window.innerWidth - 40;
            const targetCenterY = targetRect ? targetRect.top + targetRect.height / 2 : 30;

            setFlyPosition({
              left: sourceCenterX,
              top: sourceCenterY,
              x: targetCenterX - sourceCenterX,
              y: targetCenterY - sourceCenterY,
            });
            window.setTimeout(() => {
              setFlyPosition(null);
            }, 850);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 font-bold text-white transition-all duration-300 hover:-translate-y-1 ${
            isAdded ? "bg-amber-600" : "bg-green-900 hover:bg-green-800"
          }`}
        >
          <FiShoppingBag />
          {isAdded ? "تمت الإضافة للسلة" : isAvailable ? "أضف للسلة" : "احجز طلبك الآن"}
        </button>
      </div>
      {flyPosition && (
        <div
          className="cart-flying-product pointer-events-none fixed z-[70] flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-2 border-amber-300 bg-white shadow-2xl sm:h-16 sm:w-16 sm:rounded-2xl"
          style={{
            left: flyPosition.left,
            top: flyPosition.top,
            "--fly-x": `${flyPosition.x}px`,
            "--fly-y": `${flyPosition.y}px`,
          } as CSSProperties}
        >
          <Image src="/images/Hero Section.png" alt="" fill sizes="64px" className="object-cover" />
        </div>
      )}
    </>
  );
}
