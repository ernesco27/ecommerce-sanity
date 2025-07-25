import React from "react";

import { CiSearch, CiShoppingCart, CiUser } from "react-icons/ci";
import { LifeBuoy, User } from "lucide-react";

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

import { BiBox, BiHeart } from "react-icons/bi";

import Theme from "@/components/modules/header/Theme";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import ROUTES from "../../../../constants/route";

import UserAvatar from "@/components/custom/UserAvatar";
import { handleSignOut } from "@/lib/actions/signOutAction";
import { Session } from "next-auth";

const IconsGroup = ({
  openSearchBar,
  setOpenSearchBar,
  cartOpen,
  setCartOpen,
  session,
}: {
  openSearchBar: boolean;
  setOpenSearchBar: (open: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  userOpen: boolean;
  setUserOpen: (open: boolean) => void;
  cartItemsCount?: number;
  session: Session | null;
}) => {
  const router = useRouter();
  const { getTotalItems } = useCartStore();

  const user = session?.user;

  console.log("user:", user);

  return (
    <section className="">
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
                <UserAvatar
                  name={user.name ?? "User"}
                  imageUrl={user.image ?? undefined}
                />
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
                  {user ? `Welcome! ${user.name}` : "Welcome!"}
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
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button className="flex-center gap-2 hover:text-white cursor-pointer transition-all duration-200 ease-in-out bg-green-300 p-2 rounded-md w-full shadow-md">
                      <Link href={ROUTES.SIGN_IN} className="flex-center gap-2">
                        <Image
                          src="/icons/account.svg"
                          alt="Account"
                          width={20}
                          height={20}
                          className="invert-colors"
                        />
                        <span className="primary-text-gradient max-lg:hidden">
                          Log In
                        </span>
                      </Link>
                    </Button>
                    <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none cursor-pointer">
                      <Link href={ROUTES.SIGN_UP} className="flex-center gap-2">
                        <Image
                          src="/icons/sign-up.svg"
                          alt="Account"
                          width={20}
                          height={20}
                          className="invert-colors "
                        />
                        <span className="max-lg:hidden">Sign Up</span>
                      </Link>
                    </Button>
                  </div>
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
                <form action={handleSignOut}>
                  <Button
                    type="submit"
                    className="base-medium w-fit !bg-transparent px-4 py-3 cursor-pointer"
                  >
                    <Image
                      src="/icons/logout-3.svg"
                      alt="Logout"
                      width={20}
                      height={20}
                      className="invert-colors"
                    />
                    <span className="max-lg:hidden text-dark300_light900">
                      Log Out
                    </span>
                  </Button>
                </form>
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
