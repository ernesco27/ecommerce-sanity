import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First get the Sanity user document ID
    const userQuery = `*[_type == "user" && clerkUserId == $userId][0]{
      _id,
      "addresses": *[_type == "address" && references(^._id)]{
        _id,
        addressType,
        fullName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault
      }
    }`;

    const result = await writeClient.fetch(userQuery, { userId });

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ addresses: result.addresses || [] });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      addressType,
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
    } = body;

    // First get the Sanity user document ID
    const userQuery = `*[_type == "user" && clerkUserId == $userId][0]._id`;
    const sanityUserId = await writeClient.fetch(userQuery, { userId });

    if (!sanityUserId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the address document
    const address = await writeClient.create({
      _type: "address",
      addressType,
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phone,
      isDefault,
      user: {
        _type: "reference",
        _ref: sanityUserId,
      },
    });

    // Update the user document to include the new address reference
    await writeClient
      .patch(sanityUserId)
      .setIfMissing({ addresses: [] })
      .append("addresses", [
        {
          _key: uuidv4(),
          _type: "reference",
          _ref: address._id,
        },
      ])
      .commit();

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 },
    );
  }
}
