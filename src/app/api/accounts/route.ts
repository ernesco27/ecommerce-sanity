import handleError from "@/lib/handlers/error";
import { ForbiddenError } from "@/lib/http-errors";
import { AccountSchema } from "@/lib/validations";
import { writeClient } from "@/sanity/lib/client";
import { groq } from "next-sanity";

import { NextResponse } from "next/server";
import { Account } from "../../../../sanity.types";

export async function GET() {
  try {
    const query = groq`*[_type == "account"]`;

    const result: Account[] = await writeClient.fetch(query);

    if (!result || result.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = AccountSchema.parse(body);

    const existingAccountQuery = groq`
        *[_type == "account" && provider == $provider && providerAccountId == $providerAccountId][0]
      `;

    const params = {
      provider: validatedData.provider,
      providerAccountId: validatedData.providerAccountId,
    };

    const existingAccount = await writeClient.fetch(
      existingAccountQuery,
      params,
    );

    if (existingAccount) {
      throw new ForbiddenError("Account already exists");
    }

    const newAccount = await writeClient.create({
      _type: "account",
      ...validatedData,
      accountStatus: "active",
      dateJoined: new Date().toISOString(),
      isEmailVerified: false,
      preferences: {
        language: "en",
        currency: "GHS",
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
      },
      marketingPreferences: {
        emailMarketing: true,
        smsMarketing: false,
        personalization: true,
        thirdPartySharing: false,
      },
    });

    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
