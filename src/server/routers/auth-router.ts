import { currentUser } from "@clerk/nextjs/server";
import { router } from "../__internals/router";
import { publicProcedure } from "../procedures";
import { db } from "@/db";
import { HTTPException } from "hono/http-exception";

export const dynamic = "force-dynamic";

export const authRouter = router({
  getDatabaseSyncStatus: publicProcedure.query(async ({ c }) => {
    console.log("Inside auth-router ....");
    const auth = await currentUser();
    console.log("auth-email: ", auth?.emailAddresses[0].emailAddress);

    if (!auth) {
      return c.json({ isSynced: false });
    }
    console.log("auth.id: ", auth.id);
    let user = null;
    try {
      user = await db.user.findFirst({ where: { externalId: auth.id } });
      console.log("USER IN db:", user);

      if (!user) {
        await db.user.create({
          data: {
            quotaLimit: 100,
            externalId: auth.id,
            email: auth.emailAddresses[0].emailAddress,
          },
        });
      }
    } catch (err: unknown) {
      console.error("Database error in auth-router:", err);
      try {
        const e = err as
          | { message?: string; code?: string; meta?: unknown }
          | undefined;
        console.error("Prisma error message:", e?.message);
        console.error("Prisma error code:", e?.code);
        console.error("Prisma error meta:", e?.meta);
      } catch {}
      throw new HTTPException(500, { message: "Database error" });
    }

    return c.json({ isSynced: true });
  }),
});
//modified
