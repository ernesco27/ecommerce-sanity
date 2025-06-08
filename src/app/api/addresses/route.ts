import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const createAdressSchema = z.object({
  addressType: z.enum(["shipping", "billing", "both"]),
  fullName: z.string().min(5, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().optional(),
  country: z.string().min(2, "Country must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  isDefault: z.boolean(),
});

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
        email,
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

    const validation = createAdressSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: validation.error.issues },
        { status: 400 },
      );
    }

    const newAddressData = validation.data;

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
      email,
    } = newAddressData;

    // First get the Sanity user document ID
    const userQuery = `*[_type == "user" && clerkUserId == $userId][0]._id`;
    const sanityUserId = await writeClient.fetch(userQuery, { userId });

    if (!sanityUserId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const transaction = writeClient.transaction();

    // If the new address is default, unset the old default one first.
    if (isDefault) {
      const defaultAddressQuery = `*[_type == "address" && references($userId) && isDefault == true][0]._id`;
      const oldDefaultAddressId = await writeClient.fetch(defaultAddressQuery, {
        userId: sanityUserId,
      });

      if (oldDefaultAddressId) {
        transaction.patch(oldDefaultAddressId, {
          set: { isDefault: false },
        });
      }
    }

    const newAddressId = uuidv4();

    transaction.create({
      _id: `addr_${newAddressId}`,
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
      email,
      isDefault,
      user: {
        _type: "reference",
        _ref: sanityUserId,
      },
    });

    transaction.patch(sanityUserId, {
      setIfMissing: { addresses: [] },
      insert: {
        after: "addresses[-1]",
        items: [
          {
            _key: uuidv4(),
            _type: "reference",
            _ref: `addr_${newAddressId}`,
          },
        ],
      },
    });

    // Commit the transaction

    const result = await transaction.commit();
    const createdAddressId = result.results.find((res) =>
      res.id.startsWith("addr_"),
    )?.id;
    const createdAddress = createdAddressId
      ? await writeClient.getDocument(createdAddressId)
      : null;

    return NextResponse.json(
      { success: true, address: createdAddress },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 },
    );
  }
}
