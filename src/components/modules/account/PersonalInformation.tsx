"use client";

import React from "react";
import { UserResource } from "@clerk/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { User } from "../../../../sanity.types";

interface PersonalInformationProps {
  user: UserResource;
}

const PersonalInformation = ({ user }: { user: User }) => {
  const router = useRouter();

  return (
    <div className="space-y-6 w-[90%] mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-2xl font-semibold tracking-tight">
          Personal Information
        </h2>
        <Button
          size="lg"
          variant="outline"
          onClick={() => router.push("/user/profile")}
          className="hover:bg-yellow-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
        >
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="py-4">
          <CardHeader>
            <CardTitle className="lg:text-xl">Basic Information</CardTitle>
            <CardDescription className="lg:text-lg">
              Your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm lg:text-lg font-medium text-muted-foreground">
                  First Name
                </label>
                <p className="mt-1 lg:text-lg">{user.firstName || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm lg:text-lg font-medium text-muted-foreground">
                  Last Name
                </label>
                <p className="mt-1 lg:text-lg">{user.lastName || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader>
            <CardTitle className="lg:text-xl">Contact Information</CardTitle>
            <CardDescription className="lg:text-lg">
              Your contact details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <label className="text-sm lg:text-lg font-medium text-muted-foreground">
                Email Address
              </label>
              <p className="mt-1 lg:text-lg">{user?.email}</p>
            </div>
            {user.phone && (
              <div>
                <label className="text-sm lg:text-lg font-medium text-muted-foreground">
                  Phone Number
                </label>
                <p className="mt-1 lg:text-lg">{user.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader>
            <CardTitle className="lg:text-xl">Account Security</CardTitle>
            <CardDescription className="lg:text-lg">
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium lg:text-lg">Password</h4>
                <p className="text-sm lg:text-lg text-muted-foreground">
                  Change your password or enable two-factor authentication
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/user/security")}
                className="hover:bg-yellow-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
              >
                Update Security
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalInformation;
