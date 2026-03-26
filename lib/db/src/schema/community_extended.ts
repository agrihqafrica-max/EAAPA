import { pgTable, serial, text, boolean, timestamp, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const postStatusEnum = pgEnum("post_status", ["published", "draft", "flagged", "removed"]);
export const surveyStatusEnum = pgEnum("survey_status", ["draft", "active", "closed", "archived"]);

export const forumTopicsTable = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  iconName: text("icon_name"),
  color: text("color").notNull().default("#10b981"),
  threadCount: integer("thread_count").notNull().default(0),
  orderIndex: integer("order_index").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const forumPostsTable = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").notNull(),
  authorId: integer("author_id").notNull(),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  isOriginalPost: boolean("is_original_post").notNull().default(false),
  status: postStatusEnum("status").notNull().default("published"),
  likes: integer("likes").notNull().default(0),
  attachments: jsonb("attachments").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const forumCommentsTable = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => forumPostsTable.id, { onDelete: "cascade" }),
  authorId: integer("author_id").notNull(),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  status: postStatusEnum("status").notNull().default("published"),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const ratingsTable = pgTable("ratings", {
  id: serial("id").primaryKey(),
  raterId: integer("rater_id").notNull(),
  ratedEntityType: text("rated_entity_type").notNull(),
  ratedEntityId: integer("rated_entity_id").notNull(),
  score: integer("score").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  reviewerId: integer("reviewer_id").notNull(),
  reviewerName: text("reviewer_name").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  entityName: text("entity_name").notNull(),
  rating: integer("rating").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(true),
  helpful: integer("helpful").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const eventCategoriesTable = pgTable("event_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  color: text("color").notNull().default("#10b981"),
  iconName: text("icon_name"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const feedbackTable = pgTable("feedback", {
  id: serial("id").primaryKey(),
  submitterId: integer("submitter_id"),
  submitterName: text("submitter_name"),
  type: text("type").notNull().default("general"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  rating: integer("rating"),
  status: text("status").notNull().default("pending"),
  response: text("response"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const surveysTable = pgTable("surveys", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  questions: jsonb("questions").$type<Array<{ id: string; text: string; type: string; options?: string[] }>>().default([]),
  targetAudience: jsonb("target_audience").$type<string[]>().default([]),
  status: surveyStatusEnum("status").notNull().default("draft"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  responseCount: integer("response_count").notNull().default(0),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const surveyResponsesTable = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").notNull().references(() => surveysTable.id, { onDelete: "cascade" }),
  respondentId: integer("respondent_id"),
  answers: jsonb("answers").$type<Record<string, any>>().notNull().default({}),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertForumPostSchema = createInsertSchema(forumPostsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPostsTable.$inferSelect;

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviewsTable.$inferSelect;
