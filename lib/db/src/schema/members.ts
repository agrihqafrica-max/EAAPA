import { pgTable, serial, text, boolean, timestamp, integer, numeric, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const memberRoleEnum = pgEnum("member_role", ["agripreneur", "investor", "mentor", "partner", "company"]);
export const tradeReadinessEnum = pgEnum("trade_readiness", ["Ready", "Partial", "Developing"]);

export const membersTable = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: memberRoleEnum("role").notNull().default("agripreneur"),
  sector: text("sector").notNull(),
  region: text("region").notNull(),
  country: text("country").notNull(),
  commodity: text("commodity"),
  businessType: text("business_type"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  isVerified: boolean("is_verified").notNull().default(false),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  revenueUsd: numeric("revenue_usd"),
  jobsCreated: integer("jobs_created").default(0),
  yieldTons: numeric("yield_tons"),
  growthPercent: numeric("growth_percent"),
});

export const connectionsTable = pgTable("connections", {
  id: serial("id").primaryKey(),
  fromMemberId: integer("from_member_id").notNull().references(() => membersTable.id),
  toMemberId: integer("to_member_id").notNull().references(() => membersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMemberSchema = createInsertSchema(membersTable).omit({ id: true, joinedAt: true });
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof membersTable.$inferSelect;
