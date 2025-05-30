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

interface PersonalInformationProps {
  user: UserResource;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({ user }) => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Personal Information
        </h2>
        <Button variant="outline" onClick={() => router.push("/user/profile")}>
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  First Name
                </label>
                <p className="mt-1">{user.firstName || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Name
                </label>
                <p className="mt-1">{user.lastName || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Your contact details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email Address
              </label>
              <p className="mt-1">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
            {user.phoneNumbers && user.phoneNumbers.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </label>
                <p className="mt-1">{user.phoneNumbers[0].phoneNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Password</h4>
                <p className="text-sm text-muted-foreground">
                  Change your password or enable two-factor authentication
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/user/security")}
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
