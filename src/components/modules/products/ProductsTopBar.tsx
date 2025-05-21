import React from "react";
//import MobileSideBarLeft from "./MobileSideBarLeft";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenuRadioGroup } from "@radix-ui/react-dropdown-menu";
import type { ProductsQueryResult } from "../../../../sanity.types";

const ProductsTopBar = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  loading,
  setLoading,
  perPage,
  filter,
  setPerPage,
  setFilter,
  maxPage,
  page,
  products,
}: {
  minPrice: number;
  maxPrice: number;
  setMinPrice: (v: number) => void;
  setMaxPrice: (v: number) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  perPage: number;
  filter: string;
  setPerPage: (v: number) => void;
  setFilter: (v: string) => void;
  maxPage: number;
  page: number;
  products: ProductsQueryResult[0][];
}) => {
  return (
    <div className="lg:flex items-center justify-between w-full ">
      <div className="flex items-center gap-4 flex-1 justify-between w-full ">
        {/* <MobileSideBarLeft /> */}
        <div className="hidden lg:block">
          Showing {maxPage === page ? products.length : perPage * page} of{" "}
          {products.length} results
        </div>
        <div className="ms-auto ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{filter}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value="bottom">
                <DropdownMenuRadioItem
                  value="top"
                  onClick={() => setFilter("alphabetical")}
                >
                  Alphabetical
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value={filter}
                  onClick={() => setFilter("priceLowToHigh")}
                >
                  Low to High Price
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value={filter}
                  onClick={() => setFilter("priceHighToLow")}
                >
                  High to Low Price
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value={filter}
                  onClick={() => setFilter("latest")}
                >
                  Latest
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="ms-4">Show:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{perPage} </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup value="bottom">
                <DropdownMenuRadioItem
                  value="30"
                  onClick={() => setPerPage(30)}
                >
                  30
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="20"
                  onClick={() => setPerPage(20)}
                >
                  20
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="10"
                  onClick={() => setPerPage(10)}
                >
                  10
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ProductsTopBar;
