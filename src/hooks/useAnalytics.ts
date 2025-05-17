import { useEffect, useRef } from "react";
import { AnalyticsService } from "@/lib/services/analyticsService";

export const useAnalytics = () => {
  const analyticsService = AnalyticsService.getInstance();
  const startTimeRef = useRef<number>(Date.now());

  const trackProductView = async (productId: string, userId?: string) => {
    try {
      await analyticsService.trackProductView({
        productId,
        userId,
        duration: Math.floor((Date.now() - startTimeRef.current) / 1000), // Duration in seconds
      });
    } catch (error) {
      console.error("Failed to track product view:", error);
    }
  };

  const trackUserAction = async (data: {
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    details?: any;
  }) => {
    try {
      await analyticsService.trackUserAction(data);
    } catch (error) {
      console.error("Failed to track user action:", error);
    }
  };

  // Reset start time when component mounts
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  return {
    trackProductView,
    trackUserAction,
  };
};
