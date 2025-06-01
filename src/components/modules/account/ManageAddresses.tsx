"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import UserAddress from "@/components/custom/UserAddress";

const ManageAddresses = () => {
  const { user } = useUser();

  if (!user) {
    return <div>Please sign in to manage your addresses.</div>;
  }

  return (
    <div className="space-y-6 w-[90%] mx-auto">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Manage Addresses
        </h2>
        <p className="text-sm lg:text-lg text-muted-foreground">
          Add and manage your delivery addresses
        </p>
      </div>

      <UserAddress />
    </div>
  );
};

export default ManageAddresses;
