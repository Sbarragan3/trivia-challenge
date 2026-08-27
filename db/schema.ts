import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const scores = pgTable("scores", {
  id: serial().primaryKey(),
  name: text().notNull(),
  score: integer().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
