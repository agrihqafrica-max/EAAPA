import { pgTable, serial, text, boolean, timestamp, integer, numeric, jsonb, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const aiModelTypeEnum = pgEnum("ai_model_type", ["price_forecast", "demand_prediction", "buyer_match", "risk_assessment", "yield_prediction", "supply_gap"]);
export const recommendationTypeEnum = pgEnum("recommendation_type", ["crop_selection", "market_timing", "buyer_match", "funding", "training", "export_route"]);
export const signalTypeEnum = pgEnum("signal_type", ["price_spike", "supply_gap", "demand_surge", "weather_risk", "policy_change", "new_buyer"]);

export const aiOpportunitiesTable = pgTable("ai_opportunities", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id"),
  commodityName: text("commodity_name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  opportunityScore: integer("opportunity_score").notNull(),
  potentialRevenueUsd: numeric("potential_revenue_usd"),
  targetBuyers: jsonb("target_buyers").$type<string[]>().default([]),
  targetMarkets: jsonb("target_markets").$type<string[]>().default([]),
  bestTimeframe: text("best_timeframe"),
  suggestedAcreage: numeric("suggested_acreage"),
  yieldProjectionTons: numeric("yield_projection_tons"),
  requiredInvestment: numeric("required_investment"),
  riskLevel: text("risk_level").notNull().default("medium"),
  confidencePercent: integer("confidence_percent").notNull().default(75),
  isActive: boolean("is_active").notNull().default(true),
  validUntil: date("valid_until"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const aiRecommendationsTable = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  type: recommendationTypeEnum("type").notNull().default("crop_selection"),
  memberId: integer("member_id"),
  targetEntityType: text("target_entity_type"),
  targetEntityId: integer("target_entity_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  rationale: text("rationale"),
  actionItems: jsonb("action_items").$type<string[]>().default([]),
  estimatedBenefit: text("estimated_benefit"),
  confidencePercent: integer("confidence_percent").notNull().default(80),
  priority: text("priority").notNull().default("medium"),
  isActed: boolean("is_acted").notNull().default(false),
  validUntil: date("valid_until"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userBehaviorLogsTable = pgTable("user_behavior_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  sessionId: text("session_id"),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: integer("entity_id"),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const predictionModelsTable = pgTable("prediction_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: aiModelTypeEnum("type").notNull().default("price_forecast"),
  version: text("version").notNull().default("1.0"),
  description: text("description"),
  accuracy: numeric("accuracy"),
  commodities: jsonb("commodities").$type<string[]>().default([]),
  parameters: jsonb("parameters").$type<Record<string, any>>().default({}),
  lastTrainedAt: timestamp("last_trained_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const signalsTable = pgTable("signals", {
  id: serial("id").primaryKey(),
  type: signalTypeEnum("type").notNull().default("price_spike"),
  commodityId: integer("commodity_id"),
  commodityName: text("commodity_name"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  strength: integer("strength").notNull().default(50),
  direction: text("direction").notNull().default("up"),
  region: text("region"),
  country: text("country"),
  source: text("source"),
  isActionable: boolean("is_actionable").notNull().default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAiOpportunitySchema = createInsertSchema(aiOpportunitiesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAiOpportunity = z.infer<typeof insertAiOpportunitySchema>;
export type AiOpportunity = typeof aiOpportunitiesTable.$inferSelect;

export const insertSignalSchema = createInsertSchema(signalsTable).omit({ id: true, createdAt: true });
export type InsertSignal = z.infer<typeof insertSignalSchema>;
export type Signal = typeof signalsTable.$inferSelect;
