import { pgTable, serial, text, boolean, timestamp, integer, numeric, jsonb, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trainingDeliveryEnum = pgEnum("training_delivery", ["in_person", "online", "hybrid", "field"]);
export const trainingStatusEnum = pgEnum("training_status", ["draft", "published", "active", "completed", "cancelled"]);
export const enrollmentStatusEnum = pgEnum("enrollment_status", ["enrolled", "in_progress", "completed", "dropped", "certified"]);
export const certificationLevelEnum = pgEnum("certification_level", ["basic", "intermediate", "advanced", "expert", "master"]);
export const sessionStatusEnum = pgEnum("session_status", ["scheduled", "ongoing", "completed", "cancelled", "postponed"]);

export const trainingProgramsTable = pgTable("training_programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  level: certificationLevelEnum("level").notNull().default("basic"),
  delivery: trainingDeliveryEnum("delivery").notNull().default("in_person"),
  durationDays: integer("duration_days"),
  durationHours: integer("duration_hours"),
  maxParticipants: integer("max_participants").notNull().default(30),
  currentEnrollment: integer("current_enrollment").notNull().default(0),
  price: numeric("price").default("0"),
  currency: text("currency").notNull().default("KES"),
  targetAudience: text("target_audience"),
  prerequisites: jsonb("prerequisites").$type<string[]>().default([]),
  learningOutcomes: jsonb("learning_outcomes").$type<string[]>().default([]),
  facilitator: text("facilitator"),
  facilitatorOrg: text("facilitator_org"),
  venue: text("venue"),
  region: text("region"),
  country: text("country").notNull().default("Kenya"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  registrationDeadline: date("registration_deadline"),
  status: trainingStatusEnum("status").notNull().default("published"),
  isFeatured: boolean("is_featured").notNull().default(false),
  certificate: boolean("certificate").notNull().default(true),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const trainingModulesTable = pgTable("training_modules", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").notNull().references(() => trainingProgramsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull().default(1),
  durationMinutes: integer("duration_minutes"),
  contentType: text("content_type").notNull().default("lecture"),
  contentUrl: text("content_url"),
  isRequired: boolean("is_required").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const trainingSessionsTable = pgTable("training_sessions", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").notNull().references(() => trainingProgramsTable.id),
  moduleId: integer("module_id").references(() => trainingModulesTable.id),
  title: text("title").notNull(),
  date: date("date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  venue: text("venue"),
  facilitator: text("facilitator"),
  status: sessionStatusEnum("status").notNull().default("scheduled"),
  attendeeCount: integer("attendee_count").notNull().default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const programEnrollmentsTable = pgTable("program_enrollments", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").notNull().references(() => trainingProgramsTable.id),
  memberId: integer("member_id").notNull(),
  memberName: text("member_name").notNull(),
  status: enrollmentStatusEnum("status").notNull().default("enrolled"),
  progressPercent: integer("progress_percent").notNull().default(0),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  certificateIssued: boolean("certificate_issued").notNull().default(false),
  certificateId: text("certificate_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const mentorshipMatchesTable = pgTable("mentorship_matches", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").notNull(),
  menteeId: integer("mentee_id").notNull(),
  mentorName: text("mentor_name").notNull(),
  menteeName: text("mentee_name").notNull(),
  focus: text("focus"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  meetingFrequency: text("meeting_frequency").notNull().default("monthly"),
  status: text("status").notNull().default("active"),
  goalsAgreed: jsonb("goals_agreed").$type<string[]>().default([]),
  progressNotes: text("progress_notes"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const mentorshipSessionsTable = pgTable("mentorship_sessions", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull().references(() => mentorshipMatchesTable.id),
  date: date("date").notNull(),
  duration: integer("duration").notNull().default(60),
  format: text("format").notNull().default("video_call"),
  agenda: text("agenda"),
  notes: text("notes"),
  actionItems: jsonb("action_items").$type<string[]>().default([]),
  rating: integer("rating"),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const certificationsTable = pgTable("certifications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  issuingBody: text("issuing_body").notNull(),
  type: text("type").notNull().default("completion"),
  level: certificationLevelEnum("level").notNull().default("basic"),
  description: text("description"),
  validityYears: integer("validity_years"),
  requirements: jsonb("requirements").$type<string[]>().default([]),
  benefits: jsonb("benefits").$type<string[]>().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userCertificationsTable = pgTable("user_certifications", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  memberName: text("member_name").notNull(),
  certificationId: integer("certification_id").notNull().references(() => certificationsTable.id),
  enrollmentId: integer("enrollment_id").references(() => programEnrollmentsTable.id),
  certificateNumber: text("certificate_number").notNull().unique(),
  issuedAt: date("issued_at").notNull(),
  expiresAt: date("expires_at"),
  documentUrl: text("document_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTrainingProgramSchema = createInsertSchema(trainingProgramsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTrainingProgram = z.infer<typeof insertTrainingProgramSchema>;
export type TrainingProgram = typeof trainingProgramsTable.$inferSelect;

export const insertEnrollmentSchema = createInsertSchema(programEnrollmentsTable).omit({ id: true, createdAt: true, updatedAt: true, enrolledAt: true });
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof programEnrollmentsTable.$inferSelect;

export const insertMentorshipMatchSchema = createInsertSchema(mentorshipMatchesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMentorshipMatch = z.infer<typeof insertMentorshipMatchSchema>;
export type MentorshipMatch = typeof mentorshipMatchesTable.$inferSelect;
