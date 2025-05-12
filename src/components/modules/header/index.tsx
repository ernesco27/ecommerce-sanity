"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";

const Header = () => {
  const user = useUser();
  return <div></div>;
};

export default Header;
