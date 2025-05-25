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

interface SearchProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  searchScore: number;
  matchedFields: string[];
  images: {
    primary: {
      url: string;
      alt: string;
    } | null;
  };
  variants: Array<{
    price: number | null;
  }> | null;
  brand?: {
    name: string;
  };
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

const highlightMatch = (text: string, search: string) => {
  if (!search) return text;
  const regex = new RegExp(`(${search})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-100 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};

const SearchBar = ({
  openSearchBar,
  setOpenSearchBar,
}: {
  openSearchBar: boolean;
  setOpenSearchBar: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("recentSearches") || "[]");
    }
    return [];
  });

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

  // Sort results by search score
  const sortedResults = React.useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => b.searchScore - a.searchScore);
  }, [data]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setSelectedIndex(-1);
    }, 300),
    [],
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleSelectResult = (product: SearchProduct) => {
    // Save search to recent searches
    const newRecentSearches = [
      inputValue,
      ...recentSearches.filter((s) => s !== inputValue),
    ].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

    // Reset search field
    setInputValue("");
    setSearch("");

    router.push(`/products/${product.slug}`);
    setOpenSearchBar(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!sortedResults?.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < sortedResults.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && sortedResults[selectedIndex]) {
          handleSelectResult(sortedResults[selectedIndex]);
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
        className="lg:max-w-screen-lg z-[99999] w-[800px] [&>button]:hidden"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-center w-full gap-4">
          <SearchIcon className="w-8 h-8 text-slate-300" />
          <div className="relative flex-1">
            <Input
              placeholder="Search for any product..."
              className="text-slate-500 text-sm lg:text-lg font-medium lg:text-xl pr-10  focus-visible:ring-yellow-100"
              onChange={handleSearch}
              value={inputValue}
              autoFocus
            />
            {isLoading && (
              <Loader2 className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-primary-500" />
            )}
          </div>
          <Button
            className="px-4 hover:bg-yellow-500 group cursor-pointer"
            variant="outline"
            size="icon"
            onClick={() => setOpenSearchBar(false)}
          >
            <X className="group-hover:text-white " />
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

          {!error && search.length === 0 && recentSearches.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-slate-500 mb-2">
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-sm"
                    onClick={() => {
                      setInputValue(term);
                      setSearch(term);
                    }}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {!error &&
            search.length >= 3 &&
            !isLoading &&
            sortedResults?.length === 0 && (
              <div className="text-center text-slate-500 py-4">
                No products found matching your search
              </div>
            )}

          {!error &&
            sortedResults?.map((product, index) => (
              <div
                key={product._id}
                className={`group flex flex-col justify-start gap-4 px-4 items-center cursor-pointer lg:h-fit lg:flex-row lg:justify-between hover:border-gray-50 hover:scale-102 transition-all hover:shadow-lg py-4 rounded-lg ${
                  selectedIndex === index ? "bg-slate-100" : ""
                }`}
                role="button"
                onClick={() => handleSelectResult(product)}
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

                <div className="flex-1 space-y-1 px-4">
                  <div className="text-lg">
                    {highlightMatch(product.name, search)}
                  </div>

                  {product.matchedFields.includes("description") && (
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {highlightMatch(product.description, search)}
                    </p>
                  )}

                  {product.brand && product.matchedFields.includes("brand") && (
                    <p className="text-sm text-primary-500">
                      Brand: {highlightMatch(product.brand.name, search)}
                    </p>
                  )}
                </div>

                <div className="w-40 text-center lg:text-right font-bold text-xl text-yellow-700">
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
