import { pgTable, serial, text, timestamp, integer, boolean, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  leader: text("leader").notNull(),
  leaderId: integer("leader_id").notNull(),
  status: text("status").notNull().default("planning"),
  commodity: text("commodity"),
  region: text("region"),
  startDate: date("start_date"),
  memberCount: integer("member_count").notNull().default(1),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const forumThreadsTable = pgTable("forum_threads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  authorId: integer("author_id").notNull(),
  replies: integer("replies").notNull().default(0),
  views: integer("views").notNull().default(0),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, createdAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;

export const insertForumThreadSchema = createInsertSchema(forumThreadsTable).omit({ id: true, createdAt: true });
export type InsertForumThread = z.infer<typeof insertForumThreadSchema>;
export type ForumThread = typeof forumThreadsTable.$inferSelect;
