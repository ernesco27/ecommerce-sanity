"use client";

import React from "react";

import SidebarMenuContainer from "./SidebarMenuContainer";

const MobileButton = () => {
  return (
    <div className=" lg:hidden flex-center">
      <SidebarMenuContainer />
    </div>
  );
};

export default MobileButton;
