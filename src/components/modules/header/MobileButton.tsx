"use client";

import React from "react";

import SidebarMenuContainer from "./SidebarMenuContainer";

const MobileButton = () => {
  return (
    <div className="block lg:hidden">
      <SidebarMenuContainer />
    </div>
  );
};

export default MobileButton;
