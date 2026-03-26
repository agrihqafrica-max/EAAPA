import { pgTable, serial, text, boolean, timestamp, integer, numeric, jsonb, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const campaignStatusEnum = pgEnum("campaign_status", ["draft", "scheduled", "active", "paused", "completed", "cancelled"]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "qualified", "converted", "disqualified", "nurturing"]);

export const campaignsTable = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("email"),
  status: campaignStatusEnum("status").notNull().default("draft"),
  description: text("description"),
  targetAudience: jsonb("target_audience").$type<string[]>().default([]),
  budget: numeric("budget"),
  currency: text("currency").notNull().default("USD"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  sentCount: integer("sent_count").notNull().default(0),
  openCount: integer("open_count").notNull().default(0),
  clickCount: integer("click_count").notNull().default(0),
  conversionCount: integer("conversion_count").notNull().default(0),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  organization: text("organization"),
  country: text("country"),
  interestedIn: jsonb("interested_in").$type<string[]>().default([]),
  status: leadStatusEnum("status").notNull().default("new"),
  source: text("source"),
  score: integer("score").notNull().default(0),
  assignedTo: integer("assigned_to"),
  notes: text("notes"),
  convertedAt: timestamp("converted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const leadSourcesTable = pgTable("lead_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  type: text("type").notNull().default("organic"),
  description: text("description"),
  leadsCount: integer("leads_count").notNull().default(0),
  conversionRate: numeric("conversion_rate"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const conversionsTable = pgTable("conversions", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => leadsTable.id),
  memberId: integer("member_id"),
  convertedAt: timestamp("converted_at").notNull().defaultNow(),
  value: numeric("value"),
  source: text("source"),
  notes: text("notes"),
});

export const promotionsTable = pgTable("promotions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  code: text("code").unique(),
  type: text("type").notNull().default("discount"),
  discountPercent: integer("discount_percent"),
  discountAmount: numeric("discount_amount"),
  currency: text("currency").notNull().default("KES"),
  maxUsage: integer("max_usage"),
  usageCount: integer("usage_count").notNull().default(0),
  validFrom: date("valid_from"),
  validUntil: date("valid_until"),
  targetAudience: jsonb("target_audience").$type<string[]>().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const referralProgramsTable = pgTable("referral_programs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  rewardType: text("reward_type").notNull().default("credit"),
  rewardAmount: numeric("reward_amount"),
  currency: text("currency").notNull().default("KES"),
  isActive: boolean("is_active").notNull().default(true),
  startDate: date("start_date"),
  endDate: date("end_date"),
  totalReferrals: integer("total_referrals").notNull().default(0),
  totalConversions: integer("total_conversions").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCampaignSchema = createInsertSchema(campaignsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaignsTable.$inferSelect;

export const insertLeadSchema = createInsertSchema(leadsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;
