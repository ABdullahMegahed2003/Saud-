"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { readCart } from "@/components/Product/browserStorage";

const baseLinks = [
  { label: "الرئيسية", link: "/" },
  { label: "منتجاتنا", link: "/products" },
  { label: "طلب مسبق", link: "/pre-order" },
  { label: "عنا", link: "/about" },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const syncCartCount = () => {
      const cart = readCart();
      setCartCount(Object.values(cart).reduce((sum, quantity) => sum + quantity, 0));
    };

    syncCartCount();
    window.addEventListener("saudi-storage-change", syncCartCount);
    return () => window.removeEventListener("saudi-storage-change", syncCartCount);
  }, []);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 bg-white/70 py-3 shadow-md backdrop-blur-md md:py-4">
      <div className="w-11/12 mx-auto flex items-center justify-between gap-3">
        {/* Icons (left) */}
        
 <div className="flex-shrink-0 order-1 w-1/2 lg:w-1/6">
          <Link href="/" className="flex items-center  justify-between">
          <div className=" text-right">
              <h1 className="text-green-700 font-bold text-[15px] lg:text-2xl" >سعودي عندك</h1>
              <h6 className="text-orange-400 text-[10px] lg:text-[14px]" >منتجات سعودية لحد عندك</h6>
          </div>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={80}
              height={40}
              className="w-16 h-auto md:w-20 transition-transform hover:scale-105 cursor-pointer"
            />
          </Link>
        </div>

        {/* Center links */}
        <ul className="hidden md:flex items-center gap-2 lg:gap-4 order-2 flex-1 justify-center">
          {baseLinks.map((item) => (
            <li key={item.label}>
              <Link
                href={item.link}
                className="flex items-center gap-2 rounded-full px-3 lg:px-4 py-2 text-base text-gray-700 group transition-all hover:bg-gray-100"
              >
                <span className="transition-all group-hover:text-green-800 group-hover:text-lg">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logo (right) */}
        
<div className="flex items-center gap-3 md:gap-4 order-2">
          <Link
            href="/cart"
            data-cart-icon
            aria-label="الانتقال إلى سلة التسوق"
            className="relative rounded-md p-2 transition hover:bg-gray-100"
          >
            <FiShoppingCart className="text-lg md:text-xl" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-green-950">
                {cartCount > 99 ? "٩٩+" : cartCount.toLocaleString("ar-EG")}
              </span>
            )}
          </Link>

          <Link
            href="/favorites"
            aria-label="الانتقال إلى المفضلة"
            className="p-2 hover:bg-gray-100 rounded-md transition"
          >
            <FaHeart className="text-lg md:text-xl text-red-600" />
          </Link>

          <button
            onClick={() => setIsOpen((open) => !open)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-md transition"
            aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`md:hidden overflow-hidden border-t border-gray-200 transition-[max-height,opacity] duration-300 ${
          isOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="w-11/12 mx-auto py-4">
          <ul className="grid grid-cols-2 gap-3">
            {baseLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.link}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 py-3 px-3 hover:bg-gray-100 rounded-xl cursor-pointer border border-gray-100 group transition-all"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                  </span>
                  <span className="text-base text-right text-gray-700 transition-all group-hover:text-green-800 group-hover:text-lg">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </nav>
      <div className="h-16 md:h-20" aria-hidden="true" />
    </>
  );
}
