"use client";

import SocialAuthForm from "@/components/forms/SocialAuthForm";
import Image from "next/image";
import { ReactNode } from "react";

import useSWR from "swr";
import { Banner, CompanySettings } from "../../../sanity.types";

type BannerResponse = Banner & {
  imageUrl: string;
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: banners } = useSWR<BannerResponse[]>(
    "/api/banners?type=category",
    fetcher,
  );
  const { data: company } = useSWR<CompanySettings>("/api/company", fetcher);

  return (
    <main className="h-full grid grid-cols-1 lg:grid-cols-2">
      <div
        className="hidden  lg:flex"
        style={{
          backgroundImage: `url("${banners?.[2].imageUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="flex-center min-h-screen dark:bg-auth-dark bg-cover bg-center bg-no-repeat bg-auth-light px-4 py-10">
        <section className="light-border background-light800_dark200 shadow-light100_dark100 min-w-full rounded-[10px] border px-4 py-10 shadow-md sm:min-w-[520px] sm:px-8">
          <div className="flex-between gap-2">
            <div className="space-y-2.5">
              <h1 className="h2-bold text-dark100_light900 ">
                {`Join ${company?.businessName || ""}`}
              </h1>
              <p className="paragraph-regular text-dark500_light400">
                To shop your favourite apparels.
              </p>
            </div>
            {company?.logo && (
              <Image
                src={company.logo.asset?.url!}
                width={50}
                height={50}
                alt={company.logo.alt || "Edimays logo"}
              />
            )}
          </div>
          {children}
          <SocialAuthForm />
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
