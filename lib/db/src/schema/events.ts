import { pgTable, serial, text, timestamp, integer, boolean, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  country: text("country").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  registrationDeadline: date("registration_deadline"),
  attendees: integer("attendees").notNull().default(0),
  maxAttendees: integer("max_attendees").notNull().default(500),
  isFeatured: boolean("is_featured").notNull().default(false),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const resourcesTable = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  fileType: text("file_type").notNull().default("PDF"),
  fileSize: text("file_size"),
  author: text("author").notNull(),
  publishedAt: date("published_at").notNull(),
  downloads: integer("downloads").notNull().default(0),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const successStoriesTable = pgTable("success_stories", {
  id: serial("id").primaryKey(),
  agripreneurName: text("agripreneur_name").notNull(),
  title: text("title").notNull(),
  story: text("story").notNull(),
  sector: text("sector").notNull(),
  region: text("region").notNull(),
  country: text("country").notNull(),
  revenueUsd: integer("revenue_usd").notNull(),
  jobsCreated: integer("jobs_created").notNull(),
  growthPercent: integer("growth_percent").notNull(),
  commodities: jsonb("commodities").$type<string[]>().default([]),
  publishedAt: date("published_at").notNull(),
  avatarUrl: text("avatar_url"),
});

export const mentorsTable = pgTable("mentors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  expertise: jsonb("expertise").$type<string[]>().notNull().default([]),
  sector: text("sector").notNull(),
  country: text("country").notNull(),
  bio: text("bio").notNull(),
  menteeCount: integer("mentee_count").notNull().default(0),
  rating: integer("rating").notNull().default(5),
  isAvailable: boolean("is_available").notNull().default(true),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const knowledgeTable = pgTable("knowledge", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  views: integer("views").notNull().default(0),
  author: text("author").notNull(),
  publishedAt: date("published_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(eventsTable).omit({ id: true, createdAt: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type DbEvent = typeof eventsTable.$inferSelect;

export const insertResourceSchema = createInsertSchema(resourcesTable).omit({ id: true, createdAt: true });
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resourcesTable.$inferSelect;
