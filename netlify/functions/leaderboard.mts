import type { Config } from "@netlify/functions";
import { desc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { scores } from "../../db/schema.js";

export default async (req: Request) => {
  if (req.method === "GET") {
    const top = await db.select().from(scores).orderBy(desc(scores.score)).limit(10);
    return Response.json(top);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 20) : "";
    const score = Number(body?.score);

    if (!name || !Number.isFinite(score)) {
      return new Response("Invalid payload", { status: 400 });
    }

    const [inserted] = await db.insert(scores).values({ name, score }).returning();
    return Response.json(inserted, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/leaderboard",
};
