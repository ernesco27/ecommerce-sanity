import AccountLeftSidebar from "@/components/custom/AccountLeftSidebar";
import PageHeader from "@/components/modules/products/PageHeader";
import React, { ReactNode } from "react";

const AccountLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <PageHeader heading="My Account" link1="Account" />

      <div className="flex">
        <AccountLeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 py-12 max-md:pb-14 sm:px-14 ">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default AccountLayout;
