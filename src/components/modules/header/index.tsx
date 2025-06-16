"use client";

import React from "react";
import Main from "./Main";

const Header = () => {
  return (
    <nav className="h-[80px] background-light900_dark200 fixed z-50 w-full shadow-light-300 dark:shadow-none">
      <Main />
    </nav>
  );
};

export default Header;
