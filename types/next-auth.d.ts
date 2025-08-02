import "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in `Session` type to add the `id` property.
   */
  interface Session {
    user: {
      /** The user's unique identifier. */
      id: string;
    } & DefaultSession["user"];
  }
}
