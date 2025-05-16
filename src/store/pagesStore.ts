import { create } from "zustand";
import useSWR, { Fetcher } from "swr";
import { Page } from "../../sanity.types";

interface PagesState {
  pages: Page[];
  isLoading: boolean;
  error: string | null;
  fetchPages: () => Promise<void>;
  setPages: (pages: Page[]) => void;
}

export const usePagesStore = create<PagesState>((set) => ({
  pages: [],
  isLoading: false,
  error: null,
  fetchPages: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/pages");
      if (!response.ok) {
        throw new Error("Failed to fetch pages");
      }
      const pages = await response.json();

      set({ pages, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  setPages: (pages) => set({ pages }),
}));

// Custom hook that combines SWR with Zustand
export function usePages() {
  const setPages = usePagesStore((state) => state.setPages);

  const fetcher: Fetcher<Page[]> = (url: string) =>
    fetch(url).then((res) => res.json());

  const { data, error, isLoading, mutate } = useSWR<Page[]>(
    "/api/pages",
    fetcher,
    {
      onSuccess: (data) => {
        if (data) {
          setPages(data);
        }
      },
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  return {
    pages: data || [],
    error,
    isLoading,
    mutate,
  };
}
