import { useUser } from "@clerk/nextjs";
import { useCallback } from "react";

export const useOrders = () => {
  const { user } = useUser();

  const fetcher = async (url: string) => {
    const response = await fetch(url);

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({}));
      throw new Error(
        `Error fetching data from ${url}: ${response.statusText}. ${errorDetails.message || ""}`,
      );
    }

    return response.json();
  };

  const getOrders = useCallback(async () => {
    if (!user) {
      throw new Error("User is not authenticated.");
    }

    try {
      // Fetch the Sanity user document using Clerk ID
      const sanityUser = await fetcher(`/api/user/${user.id}`);

      if (!sanityUser?._id) {
        throw new Error("Invalid user data returned from API.");
      }

      // Fetch orders using the Sanity user ID
      const orders = await fetcher(`/api/orders?userId=${sanityUser._id}`);

      return orders;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      throw error;
    }
  }, [user]);

  return { getOrders };
};
