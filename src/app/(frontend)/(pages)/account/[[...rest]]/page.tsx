"use client";

import React from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";
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
import { User } from "../../../../../../sanity.types";
import useSWR from "swr";

export default function AccountPage() {
  const params = useParams();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const rest = params?.rest as string[] | undefined;
  const activeTab = searchParams.get("tab") || "personal";

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {
    data: userData,
    error,
    isLoading,
  } = useSWR<User>(user ? `/api/user/${user.id}` : null, fetcher);

  const handleTabChange = (value: string) => {
    router.push(`/account?tab=${value}`);
  };

  const clerkAppearance = {
    elements: {
      rootBox: "bg-white shadow-lg rounded-lg p-6 max-w-md",
      card: "shadow-none border-none",
      headerTitle: "text-xl font-semibold text-gray-800",
      headerSubtitle: "text-sm text-gray-600",
      profileSectionTitle: "text-base font-medium text-gray-700 mt-4",
      profileFieldInput:
        "border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg",
      profileFieldError: "text-red-500 text-sm mt-1",
    },
  };

  // If we're on the profile page
  if (rest?.[0] === "profile") {
    return (
      <div className="container mx-auto py-8">
        <PageHeader heading="Edit Profile" link1="Account" link2="Profile" />
        <Container>
          <UserProfile
            appearance={clerkAppearance}
            routing="path"
            path="/account/profile"
          />
        </Container>
      </div>
    );
  }

  // If we're on the main account page (no rest params)
  if (!rest || rest.length === 0) {
    if (!userData) {
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
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger
                  value="personal"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <UserCircle className="h-4 w-4 hidden lg:block" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Package className="h-4 w-4 hidden lg:block" />
                  My Orders
                </TabsTrigger>
                <TabsTrigger
                  value="wishlist"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Heart className="h-4 w-4 hidden lg:block" />
                  My Wishlist
                </TabsTrigger>
                <TabsTrigger
                  value="addresses"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="h-4 w-4 hidden lg:block" />
                  Addresses
                </TabsTrigger>
              </TabsList>

              <Card className="p-6">
                <TabsContent value="personal">
                  <PersonalInformation user={userData} />
                </TabsContent>

                <TabsContent value="orders">
                  <MyOrders user={userData} />
                </TabsContent>

                <TabsContent value="wishlist">
                  <MyWishlist user={userData} />
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
  }

  // Handle other account routes here if needed
  return (
    <div className="container mx-auto py-8">
      <PageHeader heading="Account" link1="Account" />
      <Container>
        <Card className="p-6">
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p>The requested page does not exist.</p>
        </Card>
      </Container>
    </div>
  );
}
