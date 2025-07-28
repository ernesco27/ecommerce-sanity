import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { UserSchema } from "@/lib/validations";
import { writeClient } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";
import { User } from "../../../../sanity.types";

export async function GET() {
  try {
    const query = groq`*[_type == "user"]`;
    const users: User[] = await writeClient.fetch(query);
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = UserSchema.safeParse(body);

    if (!validated.success) {
      throw new ValidationError(validated.error.flatten().fieldErrors);
    }

    const { email, username } = validated.data;

    const userQuery = groq`*[_type == "user" && (email == $email || username == $username)][0]`;
    const existingUser: User | null = await writeClient.fetch(userQuery, {
      email,
      username,
    });

    if (existingUser) {
      throw new Error("User with this email or username already exists");
    }

    const newUser = await writeClient.create({
      _type: "user",
      ...validated.data,
    });

    // const newUser = await writeClient.create({
    //   _type: "user",
    //   ...data,
    // });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
