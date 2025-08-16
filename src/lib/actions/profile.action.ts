"use server";

import { writeClient } from "@/sanity/lib/client";
import { Account, User } from "../../../sanity.types";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { GetUserSchema, PasswordSchema, UserSchema } from "../validations";
import { groq } from "next-sanity";
import { ForbiddenError, NotFoundError } from "../http-errors";
import bcrypt from "bcryptjs";
import { auth } from "../../../auth";

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

export async function editPassword(
  params: EditPasswordParams,
): Promise<ActionResponse<Account>> {
  const validationResult = await action({
    params,
    schema: PasswordSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { password, newPassword } = validationResult.params!;
  if (!password || !newPassword) {
    return handleError(new Error("Incomplete data")) as ErrorResponse;
  }

  const transaction = writeClient.transaction();

  const session = await auth();
  const { email } = session?.user;

  try {
    const userQuery = groq`*[_type == "user" && email == $email][0]`;
    const existingUser: User | null = await writeClient.fetch(userQuery, {
      email,
    });

    if (!existingUser) throw new NotFoundError("User");

    const accountQuery = groq`*[_type == "account" && user._ref == $userId && provider == "credentials" && providerAccountId == $email][0]`;
    const existingAccount: Account | null = await writeClient.fetch(
      accountQuery,
      {
        userId: existingUser._id,
        email,
      },
    );

    if (!existingAccount) throw new NotFoundError("Account");

    if (!existingAccount.password) {
      throw new Error("Password not set for this account.");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password,
    );

    if (!passwordMatch) throw new Error("Password does not match");

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    let updatedAccount: Account | null = null;

    if (existingAccount.password !== hashedPassword) {
      updatedAccount = await writeClient
        .patch(existingAccount._id)
        .set({
          password: hashedPassword,
        })
        .commit();

      if (!updatedAccount) throw new Error("Failed to update Account");
    }

    await transaction.commit();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedAccount || existingAccount)),
      status: 201,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
