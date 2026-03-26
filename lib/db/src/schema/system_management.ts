import { pgTable, serial, text, boolean, timestamp, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const logLevelEnum = pgEnum("log_level", ["debug", "info", "warn", "error", "critical"]);
export const auditActionEnum = pgEnum("audit_action", ["create", "read", "update", "delete", "login", "logout", "export", "import"]);

export const systemSettingsTable = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  type: text("type").notNull().default("string"),
  category: text("category").notNull().default("general"),
  description: text("description"),
  isPublic: boolean("is_public").notNull().default(false),
  isEditable: boolean("is_editable").notNull().default(true),
  updatedBy: integer("updated_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const auditLogsTable = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  userEmail: text("user_email"),
  action: auditActionEnum("action").notNull().default("read"),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id"),
  changes: jsonb("changes").$type<Record<string, any>>().default({}),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  status: text("status").notNull().default("success"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const errorLogsTable = pgTable("error_logs", {
  id: serial("id").primaryKey(),
  level: logLevelEnum("level").notNull().default("error"),
  message: text("message").notNull(),
  stack: text("stack"),
  service: text("service").notNull().default("api"),
  endpoint: text("endpoint"),
  userId: integer("user_id"),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  isResolved: boolean("is_resolved").notNull().default(false),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: integer("resolved_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const featureFlagsTable = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  isEnabled: boolean("is_enabled").notNull().default(false),
  enabledFor: jsonb("enabled_for").$type<string[]>().default([]),
  rolloutPercent: integer("rollout_percent").notNull().default(0),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const integrationsTable = pgTable("integrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  type: text("type").notNull().default("api"),
  status: text("status").notNull().default("active"),
  config: jsonb("config").$type<Record<string, any>>().default({}),
  lastSyncAt: timestamp("last_sync_at"),
  syncCount: integer("sync_count").notNull().default(0),
  errorCount: integer("error_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const apiKeysTable = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  keyHash: text("key_hash").notNull().unique(),
  keyPrefix: text("key_prefix").notNull(),
  ownerId: integer("owner_id").notNull(),
  ownerType: text("owner_type").notNull().default("member"),
  scopes: jsonb("scopes").$type<string[]>().default([]),
  isActive: boolean("is_active").notNull().default(true),
  lastUsedAt: timestamp("last_used_at"),
  usageCount: integer("usage_count").notNull().default(0),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const webhooksTable = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  events: jsonb("events").$type<string[]>().default([]),
  secret: text("secret"),
  isActive: boolean("is_active").notNull().default(true),
  lastTriggeredAt: timestamp("last_triggered_at"),
  failCount: integer("fail_count").notNull().default(0),
  successCount: integer("success_count").notNull().default(0),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSystemSettingSchema = createInsertSchema(systemSettingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
export type SystemSetting = typeof systemSettingsTable.$inferSelect;

export const insertAuditLogSchema = createInsertSchema(auditLogsTable).omit({ id: true, createdAt: true });
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogsTable.$inferSelect;
