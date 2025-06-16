"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import useSWR from "swr";
import { CompanySettings } from "../sanity.types";
import { urlFor } from "@/sanity/lib/image";
//import { ThemeProvider } from "@sanity/ui";
import { buildTheme } from "@sanity/ui/theme";
import ThemeProvider from "./Theme";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: company } = useSWR<CompanySettings>("/api/company", fetcher);

  const logoUrl = company?.logo
    ? urlFor(company.logo).url()
    : "/placeholder.png";

  //const theme = buildTheme();

  return (
    <ClerkProvider
      dynamic
      appearance={{
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "blockButton",
          logoImageUrl: `${logoUrl}`,
        },
      }}
      afterSignOutUrl="/sign-in"
      afterSignInUrl="/account/dashboard"
      signInUrl={`${process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}`}
      signUpUrl={`${process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}`}
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <ToastContainer position="top-right" theme="dark" />
      {/* <ThemeProvider theme={theme}>{children}</ThemeProvider> */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default Providers;
