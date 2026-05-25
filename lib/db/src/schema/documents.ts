import { pgTable, serial, text, boolean, timestamp, integer, pgEnum, jsonb } from "drizzle-orm/pg-core";

export const documentCategoryEnum = pgEnum("document_category", [
  "licences", "contracts", "agreements", "sales_requirements", "reports",
  "certificates", "exhibits", "notifications", "messages", "user_documents",
  "system_generated", "marketing", "financial", "legal"
]);

export const documentStatusEnum = pgEnum("document_status", [
  "active", "archived", "draft", "pending_review"
]);

export const documentTypeEnum = pgEnum("document_type", [
  "pdf", "docx", "xlsx", "csv", "image", "txt", "other"
]);

export const documentsTable = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: documentCategoryEnum("category").notNull(),
  documentType: documentTypeEnum("document_type").notNull().default("pdf"),
  status: documentStatusEnum("status").notNull().default("active"),
  fileUrl: text("file_url"),
  fileSizeKb: integer("file_size_kb").default(0),
  mimeType: text("mime_type").default("application/pdf"),
  module: text("module"),
  referenceId: integer("reference_id"),
  referenceType: text("reference_type"),
  ownerId: integer("owner_id"),
  ownerName: text("owner_name"),
  ownerRole: text("owner_role"),
  tags: jsonb("tags").$type<string[]>().default([]),
  isSystemGenerated: boolean("is_system_generated").notNull().default(false),
  isConfidential: boolean("is_confidential").notNull().default(false),
  downloadCount: integer("download_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
