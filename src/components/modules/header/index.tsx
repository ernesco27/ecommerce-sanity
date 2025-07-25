import React from "react";
import Main from "./Main";
import { auth } from "../../../../auth";

const Header = async () => {
  const session = await auth();

  return (
    <nav className="h-[80px] background-light900_dark200 fixed top-0 z-50 w-full shadow-light-300 dark:shadow-none">
      <Main session={session} />
    </nav>
  );
};

export default Header;
