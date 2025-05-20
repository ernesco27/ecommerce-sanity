import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";

// Create or get the role reference
async function getRoleReference(roleName: string) {
  // First, check if the role exists
  const existingRole = await writeClient.fetch(
    '*[_type == "role" && name == $roleName][0]._id',
    { roleName },
  );

  if (existingRole) {
    return {
      _type: "reference",
      _ref: existingRole,
      _key: existingRole,
    };
  }

  // If role doesn't exist, create it with default permissions
  const newRole = await writeClient.create({
    _type: "role",
    name: roleName,
    description: `Default ${roleName} role`,
    isActive: true,
    permissions: {
      products: {
        create: roleName === "Admin",
        read: true,
        update: roleName === "Admin" || roleName === "Manager",
        delete: roleName === "Admin",
        publish: roleName === "Admin" || roleName === "Manager",
      },
      orders: {
        view: true,
        process: roleName === "Admin" || roleName === "Manager",
        refund: roleName === "Admin",
        cancel: roleName === "Admin" || roleName === "Manager",
      },
      users: {
        create: roleName === "Admin",
        read: roleName === "Admin" || roleName === "Manager",
        update: roleName === "Admin",
        delete: roleName === "Admin",
      },
      discounts: {
        create: roleName === "Admin" || roleName === "Manager",
        read: true,
        update: roleName === "Admin" || roleName === "Manager",
        delete: roleName === "Admin",
      },
      content: {
        manage_pages: roleName === "Admin" || roleName === "Manager",
        manage_banners: roleName === "Admin" || roleName === "Manager",
        manage_categories: roleName === "Admin" || roleName === "Manager",
      },
      reports: {
        view_sales: roleName === "Admin" || roleName === "Manager",
        view_inventory: roleName === "Admin" || roleName === "Manager",
        view_customers: roleName === "Admin" || roleName === "Manager",
        export_data: roleName === "Admin" || roleName === "Manager",
      },
    },
  });

  return {
    _type: "reference",
    _ref: newRole._id,
    _key: newRole._id,
  };
}

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created" && "first_name" in evt.data) {
      const { id, first_name, last_name, email_addresses, phone_numbers } =
        evt.data;
      const email = email_addresses?.[0]?.email_address;
      const emailStatus = email_addresses?.[0]?.verification?.status;
      const phoneNumber = phone_numbers?.[0]?.phone_number ?? "";

      try {
        const role = "Customer"; // Default role for new users
        const client = await clerkClient();
        await client.users.updateUser(id, {
          publicMetadata: {
            role: role.toLowerCase(), // Store lowercase in Clerk for consistency
          },
        });

        // Get role reference for Sanity
        const roleRef = await getRoleReference(role);

        const newUser = await writeClient.create({
          _type: "user",
          firstName: first_name ?? "",
          lastName: last_name ?? "",
          email,
          phone: phoneNumber,
          accountStatus: "active",
          dateJoined: new Date().toISOString(),
          isEmailVerified: emailStatus === "verified",
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
          roles: [roleRef],
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
      const {
        id,
        first_name,
        last_name,
        email_addresses,

        phone_numbers,
      } = evt.data;
      const email = email_addresses?.[0]?.email_address;
      const emailStatus = email_addresses?.[0]?.verification?.status;
      const phoneNumber = phone_numbers?.[0]?.phone_number ?? "";

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

        // Get the user's role from Clerk metadata
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(id);
        const userRole =
          (clerkUser.publicMetadata.role as string) || "Customer";
        const roleRef = await getRoleReference(userRole);

        await writeClient
          .patch(sanityUserId)
          .set({
            firstName: first_name ?? "",
            lastName: last_name ?? "",
            email,
            phone: phoneNumber,

            isEmailVerified: emailStatus === "verified",
            roles: [roleRef],
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
