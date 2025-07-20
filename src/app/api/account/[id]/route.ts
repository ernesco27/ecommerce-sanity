import { NotFoundError, ValidationError } from "@/lib/http-errors";

import { NextResponse } from "next/server";
import handleError from "@/lib/handlers/error";
import { AccountSchema } from "@/lib/validations";
import { writeClient } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { Account } from "../../../../../sanity.types";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Document ID is required" },
      { status: 400 },
    );
  }

  try {
    const query = groq`*[_type == "account" && _id == $id][0]`;

    const account: Account = await writeClient.fetch(query, { id });

    if (!account) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Document ID is required" },
      { status: 400 },
    );
  }

  try {
    const result = await writeClient.delete(id);

    if (result.results.length === 0) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json(
      { success: true, data: result.results[0] },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Document ID is required" },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();

    const validated = AccountSchema.partial().safeParse(body);

    if (!validated.success) {
      throw new ValidationError(validated.error.flatten().fieldErrors);
    }

    const { data } = validated;

    const updatedAccount = await writeClient.patch(id).set(data).commit();

    if (!updatedAccount) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
