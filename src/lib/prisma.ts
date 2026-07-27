import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function getPrismaUrl(): string {
  // In serverless environments (Vercel, AWS Lambda), the filesystem is read-only except for /tmp.
  // We must copy the bundled SQLite file to /tmp/dev.db so SQLite can read and write without EROFS errors.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.NODE_ENV === "production") {
    const tmpDbPath = path.join("/tmp", "dev.db");
    
    if (!fs.existsSync(tmpDbPath)) {
      try {
        const possibleSources = [
          path.join(process.cwd(), "prisma", "dev.db"),
          path.join(process.cwd(), "dev.db"),
          path.resolve("./prisma/dev.db"),
          path.resolve("./dev.db")
        ];
        
        for (const src of possibleSources) {
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, tmpDbPath);
            console.log(`[Prisma] Copied SQLite database from ${src} to ${tmpDbPath}`);
            break;
          }
        }
      } catch (err) {
        console.error("[Prisma] Error copying database to /tmp:", err);
      }
    }
    
    return `file:${tmpDbPath}`;
  }

  // Local development fallback
  return process.env.DATABASE_URL || "file:./dev.db";
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
