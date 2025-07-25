"use server";

import bcrypt from "bcryptjs";
import { groq } from "next-sanity";
import slugify from "slugify";

import { signIn } from "../../../auth";
import { Account, User } from "../../../sanity.types";
import { writeClient } from "@/sanity/lib/client";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { SignInSchema, SignUpSchema } from "../validations";

export async function signUpWithCredentials(
  params: AuthCredentials,
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpSchema });

  console.log("params:", params);

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  try {
    const userQuery = groq`*[_type == "user" && email == $email][0]`;
    const existingUser: User | null = await writeClient.fetch(userQuery, {
      email,
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const usernameQuery = groq`*[_type == "user" && username == $username][0]`;
    const existingUsername: User | null = await writeClient.fetch(
      usernameQuery,
      {
        username,
      },
    );

    if (existingUsername) {
      throw new Error("Username is already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    const transaction = writeClient.transaction();
    const temporaryUserId = `newUser.${crypto.randomUUID()}`;

    transaction.create({
      _id: temporaryUserId,
      _type: "user",
      name,
      email,
      username: slugifiedUsername,
    });

    transaction.create({
      _type: "account",
      provider: "credentials",
      providerAccountId: email,
      password: hashedPassword,
      user: { _type: "reference", _ref: temporaryUserId },
    });

    await transaction.commit();

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">,
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignInSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

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

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
