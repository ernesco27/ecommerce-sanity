import React from "react";

import { CiSearch, CiShoppingCart, CiUser } from "react-icons/ci";

import { useRouter } from "next/navigation";
import CartPreview from "./CartPreview";
import Row from "@/components/custom/Row";
import SearchBar from "./SearchBar";
//import { useCartStore } from "@/store/cartStore";

const IconsGroup = ({
  openSearchBar,
  setOpenSearchBar,
  cartOpen,
  setCartOpen,
  userOpen,
  setUserOpen,
  cartItemsCount = 0,
}: {
  openSearchBar: boolean;
  setOpenSearchBar: (open: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  userOpen: boolean;
  setUserOpen: (open: boolean) => void;
  cartItemsCount?: number;
}) => {
  const router = useRouter();

  //const { items } = useCartStore();

  return (
    <section>
      <Row className="lg:gap-4">
        <SearchBar
          openSearchBar={openSearchBar}
          setOpenSearchBar={setOpenSearchBar}
        />
        <div
          className="cursor-pointer"
          onClick={() => setOpenSearchBar(!openSearchBar)}
        >
          <CiSearch size={40} className="hover:text-primary-700" />
        </div>
        <div
          className="cursor-pointer hidden lg:block relative "
          onClick={() => setCartOpen(!cartOpen)}
        >
          <CiShoppingCart size={40} className="hover:text-primary-700" />
          <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center">
            {/* {items.length} */}
          </span>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => router.push("/account/dashboard")}
        >
          <CiUser
            size={40}
            className="hover:text-primary-700 hidden lg:block"
          />
        </div>
        {/* <CartMin cartOpen={cartOpen} setCartOpen={setCartOpen} /> */}
        <CartPreview
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
          side="right"
          cartItemsCount={cartItemsCount}
        />
      </Row>
    </section>
  );
};

export default IconsGroup;
