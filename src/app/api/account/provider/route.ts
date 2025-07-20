import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import { AccountSchema } from "@/lib/validations";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";
import { Account } from "../../../../../sanity.types";
import { writeClient } from "@/sanity/lib/client";

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();

  try {
    const validatedData = AccountSchema.pick({
      providerAccountId: true,
    }).safeParse({
      providerAccountId,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const query = groq`
      *[_type == "account" && providerAccountId == $providerAccountId][0]
    `;

    const params = {
      providerAccountId: validatedData.data.providerAccountId,
    };

    const account: Account = await writeClient.fetch(query, params);

    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
