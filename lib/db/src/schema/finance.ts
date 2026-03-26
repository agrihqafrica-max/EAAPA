import { pgTable, serial, text, boolean, timestamp, integer, numeric, jsonb, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const fundingTypeEnum = pgEnum("funding_type", ["grant", "loan", "equity", "blended", "prize", "accelerator"]);
export const fundingStatusEnum = pgEnum("funding_status", ["open", "closing_soon", "closed", "awarded"]);
export const applicationStatusEnum = pgEnum("application_status", ["draft", "submitted", "under_review", "shortlisted", "approved", "rejected", "withdrawn"]);
export const investmentStageEnum = pgEnum("investment_stage", ["seed", "pre_series_a", "series_a", "series_b", "growth", "late_stage"]);
export const loanStatusEnum = pgEnum("loan_status", ["pending", "approved", "disbursed", "active", "repaid", "defaulted", "restructured"]);

export const fundingRoundsTable = pgTable("funding_rounds", {
  id: serial("id").primaryKey(),
  organizationName: text("organization_name").notNull(),
  roundName: text("round_name").notNull(),
  targetAmount: numeric("target_amount").notNull(),
  raisedAmount: numeric("raised_amount").notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  stage: investmentStageEnum("stage").notNull().default("seed"),
  openDate: date("open_date"),
  closeDate: date("close_date"),
  leadInvestor: text("lead_investor"),
  investorCount: integer("investor_count").notNull().default(0),
  sector: text("sector"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const investmentsTable = pgTable("investments", {
  id: serial("id").primaryKey(),
  investorId: integer("investor_id").notNull(),
  targetEntityType: text("target_entity_type").notNull().default("company"),
  targetEntityId: integer("target_entity_id").notNull(),
  targetEntityName: text("target_entity_name").notNull(),
  fundingRoundId: integer("funding_round_id").references(() => fundingRoundsTable.id),
  amount: numeric("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  equityPercent: numeric("equity_percent"),
  stage: investmentStageEnum("stage").notNull().default("seed"),
  investedAt: date("invested_at").notNull(),
  expectedReturnPercent: numeric("expected_return_percent"),
  actualReturnPercent: numeric("actual_return_percent"),
  sector: text("sector"),
  status: text("status").notNull().default("active"),
  exitDate: date("exit_date"),
  exitAmount: numeric("exit_amount"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const investmentParticipantsTable = pgTable("investment_participants", {
  id: serial("id").primaryKey(),
  investmentId: integer("investment_id").notNull().references(() => investmentsTable.id, { onDelete: "cascade" }),
  participantId: integer("participant_id").notNull(),
  participantName: text("participant_name").notNull(),
  role: text("role").notNull().default("co_investor"),
  amount: numeric("amount"),
  equityPercent: numeric("equity_percent"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const grantsTable = pgTable("grants", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  funder: text("funder").notNull(),
  amount: numeric("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  description: text("description"),
  eligibility: text("eligibility"),
  applicationDeadline: date("application_deadline"),
  sector: text("sector"),
  region: text("region"),
  country: text("country"),
  isOpen: boolean("is_open").notNull().default(true),
  applicationUrl: text("application_url"),
  contactEmail: text("contact_email"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const loansTable = pgTable("loans", {
  id: serial("id").primaryKey(),
  borrowerId: integer("borrower_id").notNull(),
  lenderId: integer("lender_id"),
  lenderName: text("lender_name").notNull(),
  principal: numeric("principal").notNull(),
  currency: text("currency").notNull().default("KES"),
  interestRate: numeric("interest_rate").notNull(),
  termMonths: integer("term_months").notNull(),
  purpose: text("purpose"),
  collateral: text("collateral"),
  status: loanStatusEnum("status").notNull().default("pending"),
  disbursedAt: date("disbursed_at"),
  maturityDate: date("maturity_date"),
  amountRepaid: numeric("amount_repaid").notNull().default("0"),
  nextPaymentDate: date("next_payment_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const disbursementsTable = pgTable("disbursements", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").references(() => loansTable.id),
  grantId: integer("grant_id").references(() => grantsTable.id),
  recipientId: integer("recipient_id").notNull(),
  amount: numeric("amount").notNull(),
  currency: text("currency").notNull().default("KES"),
  method: text("method").notNull().default("bank_transfer"),
  reference: text("reference"),
  disbursedAt: timestamp("disbursed_at").notNull().defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const repaymentsTable = pgTable("repayments", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").notNull().references(() => loansTable.id),
  amount: numeric("amount").notNull(),
  currency: text("currency").notNull().default("KES"),
  method: text("method").notNull().default("bank_transfer"),
  reference: text("reference"),
  paidAt: timestamp("paid_at").notNull().defaultNow(),
  principal: numeric("principal"),
  interest: numeric("interest"),
  penalty: numeric("penalty").default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const fundingApplicationsTable = pgTable("funding_applications", {
  id: serial("id").primaryKey(),
  applicantId: integer("applicant_id").notNull(),
  applicantName: text("applicant_name").notNull(),
  opportunityId: integer("opportunity_id"),
  opportunityTitle: text("opportunity_title").notNull(),
  grantId: integer("grant_id").references(() => grantsTable.id),
  fundingRoundId: integer("funding_round_id").references(() => fundingRoundsTable.id),
  amountRequested: numeric("amount_requested").notNull(),
  currency: text("currency").notNull().default("USD"),
  businessPlan: text("business_plan"),
  projectedRevenue: numeric("projected_revenue"),
  projectedJobs: integer("projected_jobs"),
  status: applicationStatusEnum("status").notNull().default("draft"),
  submittedAt: timestamp("submitted_at"),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertInvestmentSchema = createInsertSchema(investmentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Investment = typeof investmentsTable.$inferSelect;

export const insertGrantSchema = createInsertSchema(grantsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGrant = z.infer<typeof insertGrantSchema>;
export type Grant = typeof grantsTable.$inferSelect;

export const insertLoanSchema = createInsertSchema(loansTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLoan = z.infer<typeof insertLoanSchema>;
export type Loan = typeof loansTable.$inferSelect;

export const insertFundingApplicationSchema = createInsertSchema(fundingApplicationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertFundingApplication = z.infer<typeof insertFundingApplicationSchema>;
export type FundingApplication = typeof fundingApplicationsTable.$inferSelect;
