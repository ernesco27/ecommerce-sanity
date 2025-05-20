import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created" && "first_name" in evt.data) {
      const { id, first_name, last_name, email_addresses, phone_numbers } =
        evt.data;
      const email = email_addresses?.[0]?.email_address;

      const emailStatus = email_addresses?.[0]?.verification?.status;

      try {
        const role = "customer";
        const client = await clerkClient();
        await client.users.updateUser(id, {
          publicMetadata: {
            role,
          },
        });
      } catch (error) {
        console.error("Error updating user role:", error);
        return new Response(
          JSON.stringify({
            success: false,
            message: "Error updating user role",
          }),
          { status: 500 },
        );
      }

      try {
        const newUser = await writeClient.create({
          _type: "user",
          firstName: first_name ?? "",
          lastName: last_name ?? "",
          email,
          phone: phone_numbers ?? "",

          accountStatus: "active",

          dateJoined: new Date().toISOString(),
          isEmailVerified: true,
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
          roles: ["Customer"],
          clerkUserId: id,
        });

        return new Response(
          JSON.stringify({ success: true, message: newUser }),
          { status: 200 },
        );
      } catch (error) {
        console.error("Error creating user:", error);
        return new Response(
          JSON.stringify({ success: false, message: "Error creating user" }),
          { status: 500 },
        );
      }
    } else if (evt.type === "user.updated" && "first_name" in evt.data) {
      const { id, first_name, last_name, email_addresses, image_url } =
        evt.data;
      const email = email_addresses?.[0]?.email_address;
      const emailStatus = email_addresses?.[0]?.verification?.status;

      try {
        // First, find the Sanity document with matching clerkUserId
        const query =
          '*[_type == "user" && clerkUserId == $clerkUserId][0]._id';
        const sanityUserId = await writeClient.fetch(query, {
          clerkUserId: id,
        });

        if (!sanityUserId) {
          throw new Error("User not found in Sanity");
        }

        await writeClient
          .patch(sanityUserId)
          .set({
            firstName: first_name ?? "",
            lastName: last_name ?? "",
            email,
            photo: image_url
              ? {
                  _type: "image",
                  asset: {
                    _type: "reference",
                    url: image_url,
                  },
                }
              : undefined,
            isEmailVerified: emailStatus === "verified",
          })
          .commit();

        return new Response(
          JSON.stringify({ success: true, message: "User updated" }),
          { status: 200 },
        );
      } catch (error) {
        console.error("Error updating user:", error);
        return new Response(
          JSON.stringify({ success: false, message: "Error updating user" }),
          { status: 500 },
        );
      }
    } else if (evt.type === "user.deleted" && "id" in evt.data) {
      const { id } = evt.data;

      try {
        // First, find the Sanity document with matching clerkUserId
        const query =
          '*[_type == "user" && clerkUserId == $clerkUserId][0]._id';
        const sanityUserId = await writeClient.fetch(query, {
          clerkUserId: id,
        });

        if (!sanityUserId) {
          // If user not found, return success since the end result is the same
          return new Response(
            JSON.stringify({ success: true, message: "User not found" }),
            { status: 200 },
          );
        }

        await writeClient.delete(sanityUserId);

        return new Response(
          JSON.stringify({ success: true, message: "User deleted" }),
          { status: 200 },
        );
      } catch (error) {
        console.error("Error deleting user:", error);
        return new Response(
          JSON.stringify({ success: false, message: "Error deleting user" }),
          { status: 500 },
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Webhook processed" }),
      { status: 200 },
    );
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Error verifying webhook" }),
      { status: 400 },
    );
  }
}
