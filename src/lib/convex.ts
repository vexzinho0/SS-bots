import { ConvexError } from "convex/values";

interface AuthIdentity {
  tokenIdentifier: string;
  subject: string;
  name?: string;
  email?: string;
  image?: string;
}

export function ensureAuthenticated(ctx: any): AuthIdentity {
  const identity = ctx.auth.getUserIdentity() as AuthIdentity | null;
  if (!identity) {
    throw new ConvexError("Unauthenticated");
  }
  return identity;
}

export function throwError(message: string) {
  throw new ConvexError(message);
}

export function str(val: any): string {
  return String(val);
}
