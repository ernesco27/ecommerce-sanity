"use server";

import { writeClient } from "@/sanity/lib/client";
import { User } from "../../../sanity.types";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { GetUserSchema, UserSchema } from "../validations";
import { groq } from "next-sanity";
import { ForbiddenError, NotFoundError } from "../http-errors";

export async function editUser(
  params: EditUserParams,
): Promise<ActionResponse<User>> {
  const validationResult = await action({
    params,
    schema: UserSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { username, name, email, image, phone } = validationResult.params!;

  const transaction = writeClient.transaction();

  try {
    const userQuery = groq`*[_type == "user" && email == $email][0]`;
    const existingUser: User | null = await writeClient.fetch(userQuery, {
      email,
    });

    if (!existingUser) throw new NotFoundError("User");

    if (existingUser.email !== email) throw new ForbiddenError("User");

    let updatedUser: User | null = null;

    if (
      existingUser.username !== username ||
      existingUser.name !== name ||
      existingUser.email !== email ||
      existingUser.image !== image ||
      existingUser.phone !== phone
    ) {
      updatedUser = await writeClient
        .patch(existingUser._id)
        .set({
          username,
          name,
          email,
          image,
          phone,
        })
        .commit();

      if (!updatedUser) throw new Error("Failed to update user");
    }

    await transaction.commit();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedUser || existingUser)),
      status: 201,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUser(
  params: GetUserParams,
): Promise<ActionResponse<User>> {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { email } = validationResult.params!;
  if (!email) {
    return handleError(new Error("Email is required")) as ErrorResponse;
  }

  try {
    const userQuery = groq`*[_type == "user" && email == $email][0]`;
    const existingUser: User | null = await writeClient.fetch(userQuery, {
      email,
    });

    if (!existingUser) throw new NotFoundError("User");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(existingUser)),
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
