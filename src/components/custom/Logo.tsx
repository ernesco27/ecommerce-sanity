import Image from "next/image";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import { CompanySettings } from "../../../sanity.types";
import { urlFor } from "@/sanity/lib/image";

const Logo = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: company, isLoading } = useSWR<CompanySettings>(
    "/api/company",
    fetcher,
  );

  const logoUrl = company?.logo ? urlFor(company.logo).url() : "/";

  return (
    <Link href="/" className="flex-center gap-2">
      {!isLoading && (
        <Image
          src={logoUrl}
          alt={company?.logo?.alt || "logo"}
          width={50}
          height={50}
          priority
        />
      )}

      <p className="hidden lg:block h2-semibold">{company?.businessName}</p>
    </Link>
  );
};

export default Logo;
