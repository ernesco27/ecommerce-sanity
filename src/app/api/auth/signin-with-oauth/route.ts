import handleError from "@/lib/handlers/error";

import { signInWithOAuthSchema } from "@/lib/validations";
import { ValidationError } from "@/lib/http-errors";
import slugify from "slugify";
import { groq } from "next-sanity";
import { Account, User } from "../../../../../sanity.types";
import { writeClient } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = signInWithOAuthSchema.safeParse(body);

    if (!validated.success) {
      throw new ValidationError(validated.error.flatten().fieldErrors);
    }

    const { provider, providerAccountId, user: userData } = validated.data;
    const { name, email, image } = userData;
    const username = userData.username || name;
    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    // --- READ PHASE ---
    const userQuery = groq`*[_type == "user" && email == $email][0]`;
    const existingUser: User | null = await writeClient.fetch(userQuery, {
      email,
    });

    let finalUserId: string;
    const transaction = writeClient.transaction();

    // --- TRANSACTION BUILDING PHASE ---
    if (existingUser) {
      // --- PATH 1: USER EXISTS ---
      finalUserId = existingUser._id; // We have the ID already.

      // Patch user if name or image has changed.
      const updates: Partial<Pick<User, "name" | "image">> = {};
      if (existingUser.name !== name) updates.name = name;
      if (existingUser.image !== image) updates.image = image;
      if (Object.keys(updates).length > 0) {
        transaction.patch(finalUserId, { set: updates });
      }

      // Check if the specific account link exists.
      const accountQuery = groq`*[_type == "account" && user._ref == $userId && provider == $provider][0]`;
      const existingAccount: Account | null = await writeClient.fetch(
        accountQuery,
        {
          userId: finalUserId,
          provider,
        },
      );

      // Create the account link if it doesn't exist.
      if (!existingAccount) {
        transaction.create({
          _type: "account",
          provider,
          providerAccountId,
          user: { _type: "reference", _ref: finalUserId },
        });
      }
    } else {
      // --- PATH 2: USER IS NEW ---
      // Use a temporary ID to link the new user and new account within the transaction.
      const temporaryUserId = `newUser.${crypto.randomUUID()}`;

      // Create the new user document with the temporary ID.
      transaction.create({
        _id: temporaryUserId,
        _type: "user",
        name,
        email,
        image,
        username: slugifiedUsername,
      });

      // Create the new account document, referencing the temporary user ID.
      transaction.create({
        _type: "account",
        provider,
        providerAccountId,
        user: { _type: "reference", _ref: temporaryUserId },
      });
    }

    // --- COMMIT PHASE ---
    await transaction.commit();

    // --- POST-COMMIT ID RETRIEVAL ---
    if (existingUser) {
      // We already have the ID if the user existed before.
      finalUserId = existingUser._id;
    } else {
      const newlyCreatedUser: User | null = await writeClient.fetch(userQuery, {
        email,
      });

      if (!newlyCreatedUser) {
        // This should not happen if the transaction was successful, but it's a critical failsafe.
        throw new Error("Sanity transaction failed: User was not created.");
      }
      finalUserId = newlyCreatedUser._id;
    }

    // Return the permanent user ID.
    return NextResponse.json(
      { success: true, data: { userId: finalUserId } },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
