import React from "react";
import { auth } from "../../../auth";
import NavLinks from "./NavLinks";

const AccountLeftSidebar = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <section className="flex h-screen w-fit  lg:w-[266px] flex-col gap-4 background-light900_dark200 border-r light-border sticky left-0 top-0 p-6 overflow-y-auto shadow-light-300 dark:shadow-none max-sm:hidden custom-scrollbar ">
      <NavLinks userId={userId!} />
    </section>
  );
};

export default AccountLeftSidebar;
