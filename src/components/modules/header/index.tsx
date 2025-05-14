"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";
import Main from "./Main";

const Header = () => {
  const { user } = useUser();
  const createPasskey = async () => {
    try {
      const response = await user?.createPasskey();
      console.log("response:", response);
    } catch (err) {
      console.error("Error:", JSON.stringify);
    }
  };

  return (
    <header className="h-[80px]">
      <Main />
    </header>
  );
};

export default Header;
