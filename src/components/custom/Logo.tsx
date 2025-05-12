import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      {/* <Image
        src="/assets/logo.png"
        alt="logo"
        width={50}
        height={50}
        priority
      /> */}
      <p className="hidden lg:block text-2xl font-semibold">Edimays Couture</p>
    </Link>
  );
};

export default Logo;
