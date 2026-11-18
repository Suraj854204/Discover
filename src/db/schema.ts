import { sql } from "drizzle-orm";
import { boolean, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

const id = () => text("id").primaryKey().$defaultFn(() => crypto.randomUUID());
const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`);

/** The single demo user who is "logged in". */
export const users = pgTable("users", {
  id: id(),
  name: text("name").notNull(),
  createdAt: createdAt(),
});

/**
 * A discoverable person.
 * `likesUser` is PRIVATE server-side seed data. It must never be serialized to a client.
 */
export const profiles = pgTable("profiles", {
  id: id(),
  /** Stable feed order (seed order). */
  position: integer("position").notNull().default(0),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  photoUrl: text("photo_url").notNull(),
  bio: text("bio").notNull(),
  location: text("location").notNull(),
  interests: jsonb("interests").$type<string[]>().notNull(),
  likesUser: boolean("likes_user").notNull().default(false),
  createdAt: createdAt(),
});

export const swipes = pgTable(
  "swipes",
  {
    id: id(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    action: text("action", { enum: ["like", "pass"] }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("swipes_user_profile_unique").on(t.userId, t.profileId),
    index("swipes_user_action_idx").on(t.userId, t.action),
  ],
);

export const matches = pgTable(
  "matches",
  {
    id: id(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("matches_user_profile_unique").on(t.userId, t.profileId)],
);
