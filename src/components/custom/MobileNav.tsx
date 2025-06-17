"use client";

import React, { useState } from "react";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CiHeart, CiHome, CiShoppingCart, CiUser } from "react-icons/ci";
import { BiCategory } from "react-icons/bi";
import Container from "./Container";
import { motion } from "framer-motion";

import CartPreview from "../modules/header/CartPreview";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

const MobileNav = () => {
  const pathname = usePathname();

  const router = useRouter();

  const [cartOpen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { getTotalItems } = useCartStore();

  //const { items } = useCartStore();

  const navItems = [
    {
      name: "Home",
      icon: CiHome,
      href: "/",
      onClick: () => router.push("/"),
    },
    {
      name: "Categories",
      icon: BiCategory,
      href: "/categories",
      onClick: () => router.push("/categories"),
    },
    {
      name: "Cart",
      icon: CiShoppingCart,
      href: "/cart",
      onClick: () => setCartOpen(true),
    },
    {
      name: "Wishlist",
      icon: CiHeart,
      href: "/wishlist",
      onClick: () => router.push("/wishlist"),
    },
    {
      name: "Account",
      icon: CiUser,
      href: "/account",
      onClick: () => router.push("/account"),
    },
  ];

  return (
    <nav className="bottom-0 left-0 right-0  border-t border-gray-200 lg:hidden w-full overflow-hidden background-light900_dark200 fixed z-50 shadow-light-300 dark:shadow-none">
      <Container className="w-full max-w-full px-0">
        <div className="flex justify-between items-center h-16 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-1/4 flex justify-center"
              >
                <div
                  onClick={item.onClick}
                  className={cn(
                    "flex-center flex-col w-full h-full text-gray-600 dark:text-white hover:!text-primary-500 relative transition-colors",
                    isActive && "!text-primary-500",
                  )}
                >
                  <motion.div
                    animate={{
                      y: isActive ? -2 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 500 }}
                    className="relative"
                  >
                    <Icon size={24} />
                    {item.name === "Cart" && getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </motion.div>
                  <motion.span
                    className="text-xs mt-1"
                    animate={{
                      opacity: isActive ? 1 : 0.7,
                    }}
                  >
                    {item.name}
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </div>
        <CartPreview
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
          side="bottom"
        />
      </Container>
    </nav>
  );
};

export default MobileNav;
