import React from "react";

import { CiSearch, CiShoppingCart, CiUser } from "react-icons/ci";
import { LifeBuoy, Lock, LogOut, Settings, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";
import CartPreview from "./CartPreview";
import Row from "@/components/custom/Row";
import SearchBar from "./SearchBar";
import { useCartStore } from "@/store/cartStore";
import { useUser, SignOutButton, SignInButton } from "@clerk/nextjs";
import { BiBox, BiHeart } from "react-icons/bi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Theme from "@/components/modules/header/Theme";

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

  const { user } = useUser();

  const { getTotalItems } = useCartStore();

  return (
    <section>
      <Row className="gap-4">
        <SearchBar
          openSearchBar={openSearchBar}
          setOpenSearchBar={setOpenSearchBar}
        />
        <div
          className="cursor-pointer"
          onClick={() => setOpenSearchBar(!openSearchBar)}
        >
          <CiSearch size={35} className="hover:text-primary-500" />
        </div>
        <div
          className="cursor-pointer hidden lg:block relative "
          onClick={() => setCartOpen(!cartOpen)}
        >
          <CiShoppingCart size={35} className="hover:text-primary-500" />
          <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-sm w-5 h-5 rounded-full flex-center">
            {getTotalItems()}
          </span>
        </div>
        <div className="cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {user ? (
                <Avatar>
                  {user?.imageUrl ? (
                    <AvatarImage src={user?.imageUrl} />
                  ) : (
                    <AvatarFallback>
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
              ) : (
                <CiUser
                  size={35}
                  className="hover:text-primary-500 cursor-pointer"
                />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-8">
              <div className="flex-between">
                <DropdownMenuLabel>
                  {user ? "Welcome! " + user.firstName : "Welcome!"}
                </DropdownMenuLabel>
                <Theme />
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {user ? (
                  <>
                    <DropdownMenuItem>
                      <div
                        className="flex-center gap-2 hover:text-primary-500 cursor-pointer transition-all duration-200 ease-in-out"
                        onClick={() => router.push("/account?tab=personal")}
                      >
                        <User className="hover:text-primary-500" />
                        <span>Profile</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div
                        className="flex-center gap-2 hover:text-primary-500 cursor-pointer transition-all duration-200 ease-in-out"
                        onClick={() => router.push("/account?tab=orders")}
                      >
                        <BiBox className="hover:text-primary-500" />
                        <span>My Orders</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div
                        className="flex-center gap-2 hover:text-primary-500 cursor-pointer transition-all duration-200 ease-in-out"
                        onClick={() => router.push("/account?tab=wishlist")}
                      >
                        <BiHeart className="hover:text-primary-500" />
                        <span>Wishlist</span>
                      </div>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                      <div className="flex-center gap-2 hover:text-primary-500 cursor-pointer transition-all duration-200 ease-in-out">
                        <Settings className="hover:text-primary-500" />
                        <span>Settings</span>
                      </div>
                    </DropdownMenuItem> */}
                  </>
                ) : (
                  <SignInButton mode="redirect">
                    <DropdownMenuItem>
                      <div className="flex-center gap-2 hover:text-white cursor-pointer transition-all duration-200 ease-in-out bg-green-300 p-2 rounded-md w-full shadow-md">
                        <Lock className="hover:text-white" />
                        <span>Login</span>
                      </div>
                    </DropdownMenuItem>
                  </SignInButton>
                )}
              </DropdownMenuGroup>
              <DropdownMenuItem>
                <div className="flex-center gap-2 hover:text-primary-500 cursor-pointer transition-all duration-200 ease-in-out">
                  <LifeBuoy className="hover:text-primary-500 " />
                  <span>Support</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user && (
                <SignOutButton>
                  <DropdownMenuItem>
                    <div className="flex items-center justify-center gap-2 hover:text-white cursor-pointer transition-all duration-200 ease-in-out bg-red-300 p-2 rounded-md w-full shadow-md">
                      <LogOut className="hover:text-primary-500" />
                      <span>Log out</span>
                    </div>
                  </DropdownMenuItem>
                </SignOutButton>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CartPreview
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
          side="right"
        />
      </Row>
    </section>
  );
};

export default IconsGroup;
