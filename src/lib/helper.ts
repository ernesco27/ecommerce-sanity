import { auth } from "@clerk/nextjs/server";

export async function getSessionData() {
  const authData = await auth();
  const { sessionClaims, userId } = authData;

  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  return { currentUserId, role }; // Return an object with userId and role
}
