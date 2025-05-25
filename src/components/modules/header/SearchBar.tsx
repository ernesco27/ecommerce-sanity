"use client";

import React, {
  useState,
  useCallback,
  useRef,
  KeyboardEvent,
  useEffect,
} from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SearchIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Image from "next/image";
import debounce from "lodash/debounce";
import { Product } from "../../../../sanity.types";

interface SearchProduct {
  _id: string;
  name: string;
  slug: string;
  images: {
    primary: {
      url: string;
      alt: string;
    } | null;
  };
  variants: Array<{
    price: number | null;
  }> | null;
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    })
    .catch((error) => {
      console.error("Search error:", error);
      throw error;
    });

const SearchBar = ({
  openSearchBar,
  setOpenSearchBar,
}: {
  openSearchBar: boolean;
  setOpenSearchBar: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const { data, error, isLoading } = useSWR<SearchProduct[]>(
    search.length > 2
      ? `/api/products?search=${encodeURIComponent(search)}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3000,
    },
  );

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setSelectedIndex(-1);
    }, 300),
    [],
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!data?.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && data[selectedIndex]) {
          router.push(`/products/${data[selectedIndex].slug}`);
          setOpenSearchBar(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpenSearchBar(false);
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && searchResultsRef.current) {
      const element = searchResultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (element) {
        element.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <Dialog open={openSearchBar} onOpenChange={setOpenSearchBar}>
      <DialogContent
        className="lg:max-w-screen-lg z-[99999] [&>.closeBtn]:hidden"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-center w-full gap-4">
          <SearchIcon className="w-8 h-8 text-slate-300" />
          <div className="relative flex-1">
            <Input
              placeholder="Search for any product (min. 3 characters)"
              className="text-slate-500 text-lg font-medium lg:text-xl pr-10"
              onChange={handleSearch}
              autoFocus
            />
            {isLoading && (
              <Loader2 className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-primary-500" />
            )}
          </div>
          <Button
            className="px-4 hover:bg-primary-500 group"
            variant="outline"
            size="icon"
            onClick={() => setOpenSearchBar(false)}
          >
            <X className="group-hover:text-white" />
          </Button>
        </div>

        <div
          ref={searchResultsRef}
          className="flex overflow-y-auto w-full py-6 gap-4 flex-col justify-start max-h-[600px] px-4"
        >
          {error && (
            <div className="text-center text-red-500 py-4">
              An error occurred while searching. Please try again.
            </div>
          )}

          {!error && search.length > 0 && search.length < 3 && (
            <div className="text-center text-slate-500 py-4">
              Please enter at least 3 characters to search
            </div>
          )}

          {!error && search.length >= 3 && !isLoading && data?.length === 0 && (
            <div className="text-center text-slate-500 py-4">
              No products found matching your search
            </div>
          )}

          {!error &&
            data?.map((product, index) => (
              <div
                key={product._id}
                className={`group flex flex-col justify-start gap-4 px-4 items-center cursor-pointer lg:h-fit lg:flex-row lg:justify-between hover:border-gray-50 hover:scale-105 transition-all hover:shadow-lg py-4 rounded-lg ${
                  selectedIndex === index ? "bg-slate-50" : ""
                }`}
                role="button"
                onClick={() => {
                  router.push(`/products/${product.slug}`);
                  setOpenSearchBar(false);
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                tabIndex={0}
              >
                <Image
                  src={
                    product.images?.primary?.url || "/placeholder-product.png"
                  }
                  alt={product.images?.primary?.alt || product.name}
                  width={80}
                  height={60}
                  className="object-contain"
                />

                <span className="text-center text-lg lg:text-left lg:flex-1 px-4">
                  {product.name}
                </span>

                <div className="w-40 text-center font-bold text-xl text-primary-900 lg:text-right">
                  GH¢ {product.variants?.[0]?.price?.toFixed(2) || "N/A"}
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;
