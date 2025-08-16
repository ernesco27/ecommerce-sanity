import ProfileForm from "@/components/forms/ProfileForm";

import { notFound, redirect } from "next/navigation";
import React from "react";
import { auth } from "../../../../../../../auth";
import { getUser } from "@/lib/actions/profile.action";

const ProfilePage = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session || !session.user) return redirect("sign-in");

  console.log("Session user:", session.user);

  const { email } = session.user;

  if (!email) return redirect("sign-in");

  const { data: user, success } = await getUser({ email: email });
  if (!success) return notFound();

  return (
    <div>
      <ProfileForm user={user!} />
    </div>
  );
};

export default ProfilePage;
