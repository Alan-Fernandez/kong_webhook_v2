"use client";
import { useEffect, useState } from 'react';

import Link from "next/link";
import { IoSearchOutline, IoCartOutline } from "react-icons/io5";

import { titleFont } from "@/config/fonts";
import { useCartStore, useUIStore } from "@/store";
import Search from '../search/search';
import NavLinks from '../nav-links';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const TopMenu = () => {
  const pathname = usePathname();
  const openSideMenu = useUIStore((state) => state.openSideMenu);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, [])

// kong_webhook
  return (
    <nav className="flex px-5 justify-between items-center w-full bg-gray-800 text-white">
      {/* Logo */}
      <div className="flex flex-shrink-0 items-center">
        <Image
          alt="Your Company"
          src="https://res.cloudinary.com/df5jwzuq9/image/upload/v1720536741/logokw_bnxvjo.png"
          width={200} 
          height={60} 
          className="h-12 w-auto"
        />
        <Link href="/">
          <span className={`${titleFont.className } antialiased font-bold`}>
            kong
          </span>
          <span> | webhook</span>
        </Link>
      </div>

      {/* Center Menu */}

      <div className="hidden sm:ml-6 sm:block">
        <div className="flex space-x-4">
          <NavLinks/>
        </div>
      </div>
      
      {/* Search, Cart, Menu */}
      <div className="flex items-center">
        {(pathname !== '/cart' && !pathname.startsWith('/product')) && (
          <div className="flex items-center justify-between text-black">
            <Search placeholder="Buscar productos..." />
          </div>
        )}

        <Link href={
            ( (totalItemsInCart === 0 ) && loaded )
              ? '/empty'
              : "/cart"
          } className="mx-2 hover:bg-gray-900 rounded-md">
          <div className="relative ">
            {  ( loaded && totalItemsInCart > 0) && (
              <span className="fade-in absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-white ">
                {totalItemsInCart}
              </span>
            )}
            <IoCartOutline className="w-5 h-5 " />
          </div>
        </Link>

        <button
          onClick={openSideMenu}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-900"
        >
          Menú
        </button>
      </div>
    </nav>
  );
};
