"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/modules/products/PageHeader";
import { UserCircle, Package, Heart, MapPin } from "lucide-react";
import PersonalInformation from "@/components/modules/account/PersonalInformation";
import MyOrders from "@/components/modules/account/MyOrders";
import MyWishlist from "@/components/modules/account/MyWishlist";
import ManageAddresses from "@/components/modules/account/ManageAddresses";
import Container from "@/components/custom/Container";
import { Skeleton } from "@/components/ui/skeleton";

const AccountPage = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="w-full h-[80vh]" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <PageHeader heading="My Account" link1="Account" />
      <Container>
        <div className="mt-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 hidden lg:block" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4 hidden lg:block" />
                My Orders
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="h-4 w-4 hidden lg:block" />
                My Wishlist
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 hidden lg:block" />
                Addresses
              </TabsTrigger>
            </TabsList>

            <Card className="p-6">
              <TabsContent value="personal">
                <PersonalInformation user={user} />
              </TabsContent>

              <TabsContent value="orders">
                <MyOrders />
              </TabsContent>

              <TabsContent value="wishlist">
                <MyWishlist />
              </TabsContent>

              <TabsContent value="addresses">
                <ManageAddresses />
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default AccountPage;
