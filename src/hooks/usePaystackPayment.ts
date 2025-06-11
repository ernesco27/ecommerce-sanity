import { useCallback, useEffect, useState } from "react";

interface PaystackConfig {
  email: string;
  amount: number;
  publicKey: string;
  firstname?: string;
  lastname?: string;
  onSuccess: () => void;
  onClose: () => void;
  metadata?: Record<string, any>;
  currency?: string;
  channels?: string[];
  reference?: string;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => { openIframe: () => void };
    };
  }
}

export const usePaystackPayment = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (typeof window !== "undefined" && window.PaystackPop) {
      setIsScriptLoaded(true);
      return;
    }

    // If not loaded, wait for it to load
    const checkScriptLoaded = setInterval(() => {
      if (typeof window !== "undefined" && window.PaystackPop) {
        setIsScriptLoaded(true);
        clearInterval(checkScriptLoaded);
      }
    }, 500);

    // Cleanup interval
    return () => clearInterval(checkScriptLoaded);
  }, []);

  const initializePayment = useCallback(
    (config: PaystackConfig) => {
      if (typeof window === "undefined") {
        throw new Error(
          "Paystack can only be initialized in browser environment",
        );
      }

      if (!isScriptLoaded || !window.PaystackPop) {
        throw new Error("Paystack script not loaded yet. Please try again.");
      }

      try {
        console.log("config:", config);

        const handler = window.PaystackPop.setup({
          ...config,
          currency: config.currency || "GHS",
          channels: config.channels || ["card"],
          reference: config.reference || String(new Date().getTime()),
        });

        handler.openIframe();
      } catch (error) {
        console.error("Failed to initialize Paystack:", error);
        throw error;
      }
    },
    [isScriptLoaded],
  );

  return { initializePayment, isScriptLoaded };
};

// import { useCallback, useEffect, useState } from "react";

// interface PaystackConfig {
//   email: string;
//   amount: number;
//   publicKey: string;
//   firstname?: string;
//   lastname?: string;
//   onSuccess: () => void;
//   onClose: () => void;
//   metadata?: Record<string, any>;
//   currency?: string;
//   channels?: string[];
//   reference?: string;
// }

// declare global {
//   interface Window {
//     PaystackPop: {
//       setup: (config: PaystackConfig) => { openIframe: () => void };
//     };
//   }
// }

// export const usePaystackPayment = () => {
//   const [isScriptLoaded, setIsScriptLoaded] = useState(false);

//   useEffect(() => {
//     const scriptId = "paystack-script";

//     if (document.getElementById(scriptId)) {
//       setIsScriptLoaded(true);
//       return;
//     }

//     const script = document.createElement("script");
//     script.id = scriptId;
//     script.src = "https://js.paystack.co/v1/inline.js";
//     script.async = true;

//     script.onload = () => setIsScriptLoaded(true);
//     script.onerror = () => console.error("Failed to load Paystack script");

//     document.body.appendChild(script);

//     return () => {
//       document.getElementById(scriptId)?.remove();
//     };
//   }, []);

//   const initializePayment = useCallback(
//     (config: PaystackConfig) => {
//       if (typeof window === "undefined") {
//         throw new Error(
//           "Paystack can only be initialized in a browser environment",
//         );
//       }

//       if (!isScriptLoaded || !window.PaystackPop) {
//         throw new Error("Paystack script not loaded yet. Please try again.");
//       }

//       try {
//         const handler = window.PaystackPop.setup({
//           ...config,
//           currency: config.currency || "GHS",
//           channels: config.channels || ["card"],
//           reference: config.reference || String(new Date().getTime()),
//         });

//         handler.openIframe();
//       } catch (error) {
//         console.error("Failed to initialize Paystack:", error);
//         throw error;
//       }
//     },
//     [isScriptLoaded],
//   );

//   return { initializePayment, isScriptLoaded };
// };
