import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export async function POST(req: Request) {
  try {
    const { code, cartItems, userId } = await req.json();

    // Validate required fields
    if (!code) {
      return NextResponse.json(
        { success: false, error: "Discount code is required" },
        { status: 400 },
      );
    }

    // Query the discount from Sanity
    const discount = await client.fetch(
      groq`*[_type == "discount" && code == $code && isActive == true][0]{
        _id,
        name,
        type,
        value,
        minOrderValue,
        maxDiscount,
        startDate,
        endDate,
        usageLimit,
        applicableTo,
        exclusions
      }`,
      { code: code.toUpperCase() },
    );

    if (!discount) {
      return NextResponse.json(
        { success: false, error: "Invalid discount code" },
        { status: 404 },
      );
    }

    // Check if discount is active based on dates
    const now = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);

    if (now < startDate || now > endDate) {
      return NextResponse.json(
        { success: false, error: "Discount code has expired" },
        { status: 400 },
      );
    }

    // Calculate cart subtotal
    const subtotal = cartItems.reduce(
      (total: number, item: any) =>
        total + item.selectedVariant.price * item.quantity,
      0,
    );

    // Check minimum order value
    if (discount.minOrderValue && subtotal < discount.minOrderValue) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order value of ${discount.minOrderValue} required`,
        },
        { status: 400 },
      );
    }

    // Check usage limits if user is logged in
    if (userId && discount.usageLimit) {
      const usageCount = await client.fetch(
        groq`count(*[_type == "order" && references($userId) && references($discountId)])`,
        { userId, discountId: discount._id },
      );

      if (
        discount.usageLimit.perCustomer &&
        usageCount >= discount.usageLimit.perCustomer
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "You have reached the usage limit for this discount",
          },
          { status: 400 },
        );
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.type === "percentage") {
      discountAmount = (subtotal * discount.value) / 100;
      if (discount.maxDiscount) {
        discountAmount = Math.min(discountAmount, discount.maxDiscount);
      }
    } else if (discount.type === "amount") {
      discountAmount = discount.value;
    }

    return NextResponse.json({
      success: true,
      discount: {
        _id: discount._id,
        name: discount.name,
        type: discount.type,
        value: discount.value,
        amount: discountAmount,
        code: code.toUpperCase(),
      },
    });
  } catch (error) {
    console.error("Discount validation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to validate discount" },
      { status: 500 },
    );
  }
}
