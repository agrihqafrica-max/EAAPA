import { pgTable, serial, text, boolean, timestamp, integer, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const legalDocumentStatusEnum = pgEnum("legal_document_status", ["draft", "active", "expired", "superseded", "archived"]);
export const disputeStatusEnum = pgEnum("dispute_status", ["open", "under_review", "mediation", "resolved", "escalated", "closed"]);
export const licenseStatusEnum = pgEnum("license_status", ["pending", "active", "suspended", "expired", "revoked"]);

export const legalDocumentsTable = pgTable("legal_documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull().default("terms"),
  version: text("version").notNull().default("1.0"),
  content: text("content").notNull(),
  status: legalDocumentStatusEnum("status").notNull().default("active"),
  effectiveDate: date("effective_date").notNull(),
  expiryDate: date("expiry_date"),
  createdBy: integer("created_by"),
  approvedBy: integer("approved_by"),
  documentUrl: text("document_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contractsLegalTable = pgTable("legal_contracts", {
  id: serial("id").primaryKey(),
  partyOneId: integer("party_one_id").notNull(),
  partyOneName: text("party_one_name").notNull(),
  partyTwoId: integer("party_two_id").notNull(),
  partyTwoName: text("party_two_name").notNull(),
  contractNumber: text("contract_number").notNull().unique(),
  type: text("type").notNull().default("service_agreement"),
  summary: text("summary"),
  effectiveDate: date("effective_date").notNull(),
  expiryDate: date("expiry_date"),
  value: text("value"),
  status: legalDocumentStatusEnum("status").notNull().default("active"),
  documentUrl: text("document_url"),
  signedAt: timestamp("signed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const complianceRecordsTable = pgTable("compliance_records", {
  id: serial("id").primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  entityName: text("entity_name").notNull(),
  complianceType: text("compliance_type").notNull(),
  status: text("status").notNull().default("compliant"),
  lastCheckedAt: date("last_checked_at"),
  nextCheckDate: date("next_check_date"),
  notes: text("notes"),
  documents: text("documents"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const licensesTable = pgTable("licenses", {
  id: serial("id").primaryKey(),
  holderId: integer("holder_id").notNull(),
  holderName: text("holder_name").notNull(),
  holderType: text("holder_type").notNull().default("individual"),
  licenseType: text("license_type").notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  issuingAuthority: text("issuing_authority").notNull(),
  issueDate: date("issue_date").notNull(),
  expiryDate: date("expiry_date"),
  status: licenseStatusEnum("status").notNull().default("active"),
  documentUrl: text("document_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const disputesTable = pgTable("disputes", {
  id: serial("id").primaryKey(),
  caseNumber: text("case_number").notNull().unique(),
  complainantId: integer("complainant_id").notNull(),
  complainantName: text("complainant_name").notNull(),
  respondentId: integer("respondent_id"),
  respondentName: text("respondent_name"),
  category: text("category").notNull().default("trade"),
  description: text("description").notNull(),
  claimAmount: text("claim_amount"),
  status: disputeStatusEnum("status").notNull().default("open"),
  assignedMediator: text("assigned_mediator"),
  filedAt: timestamp("filed_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const resolutionsTable = pgTable("resolutions", {
  id: serial("id").primaryKey(),
  disputeId: integer("dispute_id").notNull().references(() => disputesTable.id),
  description: text("description").notNull(),
  outcome: text("outcome").notNull(),
  agreedAmount: text("agreed_amount"),
  mediator: text("mediator"),
  resolvedAt: timestamp("resolved_at").notNull().defaultNow(),
  acceptedByComplainant: boolean("accepted_by_complainant").notNull().default(false),
  acceptedByRespondent: boolean("accepted_by_respondent").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDisputeSchema = createInsertSchema(disputesTable).omit({ id: true, createdAt: true, updatedAt: true, filedAt: true });
export type InsertDispute = z.infer<typeof insertDisputeSchema>;
export type Dispute = typeof disputesTable.$inferSelect;

export const insertLicenseSchema = createInsertSchema(licensesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLicense = z.infer<typeof insertLicenseSchema>;
export type License = typeof licensesTable.$inferSelect;
