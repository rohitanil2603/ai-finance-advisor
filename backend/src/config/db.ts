import { PrismaClient } from "@prisma/client";
import { env } from "./env";

// Reuse a single PrismaClient across `tsx watch` hot reloads in dev to avoid exhausting
// the database's connection pool.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = global.__prisma ?? new PrismaClient();

if (env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
