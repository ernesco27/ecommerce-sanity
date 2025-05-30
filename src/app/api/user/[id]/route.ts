import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow users to fetch their own data
    const { id } = await params;
    if (userId !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch the Sanity user document using the Clerk ID
    const user = await client.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]{
        _id,
        firstName,
        lastName,
        email,
        phone,
        accountStatus,
        preferences,
        addresses
      }`,
      { clerkUserId: userId },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}
