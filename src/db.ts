import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "./generated/client";

declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  });
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.cachedPrisma) {
    const adapter = new PrismaNeon({
      connectionString: process.env.DATABASE_URL!,
    });
    global.cachedPrisma = new PrismaClient({ adapter });
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;
