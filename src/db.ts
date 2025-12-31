import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";

//import { PrismaNeon } from "@prisma/adapter-neon";
//import { neonConfig } from "@neondatabase/serverless";
//import ws from "ws";
//eonConfig.webSocketConstructor = ws;
// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

// Type definitions for the global Prisma client (Next.js hot reload)
declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30_000,
});

const prisma =
  global.prisma ||
  new PrismaClient({ adapter, log: ["query", "info", "warn", "error"] });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export const db = prisma;
