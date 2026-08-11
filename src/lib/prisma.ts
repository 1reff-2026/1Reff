import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function getPrismaUrl(): string {
  return process.env.DATABASE_URL || "";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getPrismaUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
