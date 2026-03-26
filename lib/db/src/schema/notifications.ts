import { pgTable, serial, text, boolean, timestamp, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const notificationTypeEnum = pgEnum("notification_type", ["alert", "message", "update", "opportunity", "reminder", "system", "achievement"]);
export const messageStatusEnum = pgEnum("message_status", ["sent", "delivered", "read", "failed"]);
export const conversationStatusEnum = pgEnum("conversation_status", ["active", "archived", "blocked"]);

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  memberId: integer("member_id"),
  type: notificationTypeEnum("type").notNull().default("update"),
  title: text("title").notNull(),
  message: text("message").notNull(),
  entityType: text("entity_type"),
  entityId: integer("entity_id"),
  actionUrl: text("action_url"),
  isRead: boolean("is_read").notNull().default(false),
  readAt: timestamp("read_at"),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notificationPreferencesTable = pgTable("notification_preferences", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull().unique(),
  emailAlerts: boolean("email_alerts").notNull().default(true),
  smsAlerts: boolean("sms_alerts").notNull().default(false),
  pushNotifications: boolean("push_notifications").notNull().default(true),
  marketAlerts: boolean("market_alerts").notNull().default(true),
  connectionRequests: boolean("connection_requests").notNull().default(true),
  forumReplies: boolean("forum_replies").notNull().default(true),
  eventReminders: boolean("event_reminders").notNull().default(true),
  fundingAlerts: boolean("funding_alerts").notNull().default(true),
  weeklyDigest: boolean("weekly_digest").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const conversationsTable = pgTable("conversations", {
  id: serial("id").primaryKey(),
  participantOneId: integer("participant_one_id").notNull(),
  participantTwoId: integer("participant_two_id").notNull(),
  participantOneName: text("participant_one_name").notNull(),
  participantTwoName: text("participant_two_name").notNull(),
  status: conversationStatusEnum("status").notNull().default("active"),
  lastMessageAt: timestamp("last_message_at"),
  lastMessagePreview: text("last_message_preview"),
  unreadCountOne: integer("unread_count_one").notNull().default(0),
  unreadCountTwo: integer("unread_count_two").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversationsTable.id, { onDelete: "cascade" }),
  senderId: integer("sender_id").notNull(),
  senderName: text("sender_name").notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").notNull().default("text"),
  attachmentUrl: text("attachment_url"),
  status: messageStatusEnum("status").notNull().default("sent"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const emailLogsTable = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  toEmail: text("to_email").notNull(),
  toName: text("to_name"),
  subject: text("subject").notNull(),
  templateId: text("template_id"),
  status: text("status").notNull().default("pending"),
  sentAt: timestamp("sent_at"),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const smsLogsTable = pgTable("sms_logs", {
  id: serial("id").primaryKey(),
  toPhone: text("to_phone").notNull(),
  message: text("message").notNull(),
  provider: text("provider").notNull().default("africa_talking"),
  status: text("status").notNull().default("pending"),
  messageId: text("message_id"),
  sentAt: timestamp("sent_at"),
  cost: text("cost"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pushNotificationsTable = pgTable("push_notifications", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  deviceToken: text("device_token"),
  status: text("status").notNull().default("pending"),
  sentAt: timestamp("sent_at"),
  clickedAt: timestamp("clicked_at"),
  data: jsonb("data").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notificationsTable).omit({ id: true, createdAt: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notificationsTable.$inferSelect;

export const insertMessageSchema = createInsertSchema(messagesTable).omit({ id: true, createdAt: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messagesTable.$inferSelect;

export const insertConversationSchema = createInsertSchema(conversationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversationsTable.$inferSelect;
