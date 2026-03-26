import { pgTable, serial, text, boolean, timestamp, integer, jsonb, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contentStatusEnum = pgEnum("content_status", ["draft", "published", "archived", "featured"]);
export const mediaTypeEnum = pgEnum("media_type_enum", ["image", "video", "audio", "document", "infographic"]);

export const announcementsTable = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("general"),
  priority: text("priority").notNull().default("normal"),
  targetAudience: jsonb("target_audience").$type<string[]>().default([]),
  isActive: boolean("is_active").notNull().default(true),
  publishedAt: timestamp("published_at"),
  expiresAt: timestamp("expires_at"),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const faqsTable = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull().default("general"),
  orderIndex: integer("order_index").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  views: integer("views").notNull().default(0),
  helpful: integer("helpful").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const newsTable = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("industry"),
  author: text("author").notNull(),
  authorId: integer("author_id"),
  thumbnailUrl: text("thumbnail_url"),
  source: text("source"),
  externalUrl: text("external_url"),
  tags: jsonb("tags").$type<string[]>().default([]),
  status: contentStatusEnum("status").notNull().default("published"),
  views: integer("views").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const blogArticlesTable = pgTable("blog_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  authorId: integer("author_id"),
  thumbnailUrl: text("thumbnail_url"),
  readTimeMinutes: integer("read_time_minutes").notNull().default(5),
  tags: jsonb("tags").$type<string[]>().default([]),
  status: contentStatusEnum("status").notNull().default("published"),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const knowledgeArticlesTable = pgTable("knowledge_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  author: text("author").notNull(),
  authorId: integer("author_id"),
  commodityId: integer("commodity_id"),
  relatedCommodities: jsonb("related_commodities").$type<string[]>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]),
  status: contentStatusEnum("status").notNull().default("published"),
  views: integer("views").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  attachmentUrl: text("attachment_url"),
  publishedAt: date("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const researchDocumentsTable = pgTable("research_documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  abstract: text("abstract").notNull(),
  authors: jsonb("authors").$type<string[]>().default([]),
  institution: text("institution"),
  topic: text("topic").notNull(),
  keywords: jsonb("keywords").$type<string[]>().default([]),
  fileUrl: text("file_url"),
  externalUrl: text("external_url"),
  publishedYear: integer("published_year"),
  pages: integer("pages"),
  citations: integer("citations").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  isOpenAccess: boolean("is_open_access").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const mediaGalleryTable = pgTable("media_gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: mediaTypeEnum("type").notNull().default("image"),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  description: text("description"),
  tags: jsonb("tags").$type<string[]>().default([]),
  albumName: text("album_name"),
  uploadedBy: integer("uploaded_by"),
  isPublic: boolean("is_public").notNull().default(true),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const caseStudiesTable = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  organization: text("organization").notNull(),
  sector: text("sector").notNull(),
  country: text("country").notNull().default("Kenya"),
  commodities: jsonb("commodities").$type<string[]>().default([]),
  challenge: text("challenge"),
  solution: text("solution"),
  results: text("results"),
  keyMetrics: jsonb("key_metrics").$type<Record<string, any>>().default({}),
  thumbnailUrl: text("thumbnail_url"),
  author: text("author"),
  status: contentStatusEnum("status").notNull().default("published"),
  publishedAt: date("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const testimonialsTable = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  authorTitle: text("author_title"),
  organization: text("organization"),
  country: text("country"),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  avatarUrl: text("avatar_url"),
  isPublished: boolean("is_published").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNewsSchema = createInsertSchema(newsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof newsTable.$inferSelect;

export const insertBlogArticleSchema = createInsertSchema(blogArticlesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBlogArticle = z.infer<typeof insertBlogArticleSchema>;
export type BlogArticle = typeof blogArticlesTable.$inferSelect;

export const insertAnnouncementSchema = createInsertSchema(announcementsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcementsTable.$inferSelect;
