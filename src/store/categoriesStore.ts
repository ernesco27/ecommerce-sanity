import { create } from "zustand";
import useSWR, { Fetcher } from "swr";
import { Category } from "../../sanity.types";

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  setCategories: (categories: Category[]) => void;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  isLoading: false,
  error: null,
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const categories = await response.json();
      set({ categories, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  setCategories: (categories) => set({ categories }),
}));

// Custom hook that combines SWR with Zustand
export function useCategories() {
  const setCategories = useCategoriesStore((state) => state.setCategories);
  //const categories = useCategoriesStore((state) => state.categories);

  const fetcher: Fetcher<Category[]> = (url: string) =>
    fetch(url).then((res) => res.json());

  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    "/api/categories",
    fetcher,
    {
      onSuccess: (data) => {
        setCategories(data);
      },
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  return {
    categories: data || [],
    error,
    isLoading,
    mutate,
  };
}
