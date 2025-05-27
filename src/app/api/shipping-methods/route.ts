import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `*[_type == "shippingMethod" && isAvailable == true] {
      _id,
      name,
      description,
      price,
      "estimatedDays": estimatedDays + " business days"
    }`;

    const shippingMethods = await client.fetch(query);

    return NextResponse.json(shippingMethods);
  } catch (error) {
    console.error("Error fetching shipping methods:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipping methods" },
      { status: 500 },
    );
  }
}
