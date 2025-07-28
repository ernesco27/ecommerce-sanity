import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";

import { NextResponse } from "next/server";
import { UserSchema } from "@/lib/validations";
import { writeClient } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { User } from "../../../../../sanity.types";

// GET User by Id
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) throw new NotFoundError("User");

  try {
    const query = groq`*[_type == "user" && _id == $id][0]`;

    const user: User = await writeClient.fetch(query, { id });

    if (!user) {
      throw new NotFoundError("User");
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// DELETE User

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) throw new NotFoundError("User");

  try {
    const result = await writeClient.delete(id);

    if (result.results.length === 0) {
      throw new NotFoundError("User");
    }

    return NextResponse.json(
      { success: true, data: result.results[0] },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// UPDATE User

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) throw new NotFoundError("User");

  try {
    const body = await request.json();

    const validated = UserSchema.partial().safeParse(body);

    if (!validated.success) {
      throw new ValidationError(validated.error.flatten().fieldErrors);
    }

    const { data } = validated;

    const updatedUser = await writeClient.patch(id).set(data).commit();

    if (!updatedUser) {
      throw new NotFoundError("User");
    }

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
