import { pgTable, serial, text, boolean, timestamp, integer, numeric, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const demandLevelEnum = pgEnum("demand_level", ["Low", "Medium", "High", "Very High"]);
export const trendEnum = pgEnum("trend", ["up", "down", "stable"]);
export const marketHealthEnum = pgEnum("market_health", ["Green", "Yellow", "Red"]);
export const alertTypeEnum = pgEnum("alert_type", ["price_spike", "supply_gap", "high_demand", "shortage", "forecast"]);
export const alertSeverityEnum = pgEnum("alert_severity", ["low", "medium", "high", "critical"]);

export const commoditiesTable = pgTable("commodities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  avgPrice: numeric("avg_price").notNull(),
  currency: text("currency").notNull().default("KES"),
  demandLevel: demandLevelEnum("demand_level").notNull().default("Medium"),
  marketSizeUsd: numeric("market_size_usd").notNull(),
  topBuyers: jsonb("top_buyers").$type<string[]>().notNull().default([]),
  trend: trendEnum("trend").notNull().default("stable"),
  marketHealth: marketHealthEnum("market_health").notNull().default("Green"),
  region: text("region").notNull(),
  isExport: boolean("is_export").notNull().default(false),
  isOrganic: boolean("is_organic").notNull().default(false),
  priceChange7d: numeric("price_change_7d"),
  priceChange30d: numeric("price_change_30d"),
  globalPrice: numeric("global_price"),
  demandGrowthPercent: numeric("demand_growth_percent"),
  importRegions: jsonb("import_regions").$type<string[]>().default([]),
  exportRegions: jsonb("export_regions").$type<string[]>().default([]),
  variety: text("variety"),
  qualityStandards: jsonb("quality_standards").$type<string[]>().default([]),
  packaging: jsonb("packaging").$type<string[]>().default([]),
  certifications: jsonb("certifications").$type<string[]>().default([]),
  exportRequirements: jsonb("export_requirements").$type<string[]>().default([]),
  tonsPerYear: numeric("tons_per_year"),
  exportRoutes: jsonb("export_routes").$type<string[]>().default([]),
  avgDeliveryDays: integer("avg_delivery_days"),
  costPerTon: numeric("cost_per_ton"),
  opportunityScore: integer("opportunity_score"),
  suggestedAcreage: numeric("suggested_acreage"),
  yieldProjectionTons: numeric("yield_projection_tons"),
  revenueProjectionUsd: numeric("revenue_projection_usd"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const priceHistoryTable = pgTable("price_history", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id").notNull().references(() => commoditiesTable.id),
  date: text("date").notNull(),
  price: numeric("price").notNull(),
});

export const buyersTable = pgTable("buyers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  weeklyDemandTons: numeric("weekly_demand_tons").notNull(),
  monthlyDemandTons: numeric("monthly_demand_tons").notNull(),
  yearlyDemandTons: numeric("yearly_demand_tons").notNull(),
  sustainabilityScore: integer("sustainability_score").notNull(),
  aiMatchScore: integer("ai_match_score").notNull(),
  tradeReadiness: text("trade_readiness").notNull().default("Ready"),
  currency: text("currency").notNull().default("USD"),
  commodities: jsonb("commodities").$type<string[]>().notNull().default([]),
  isAiRecommended: boolean("is_ai_recommended").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const marketAlertsTable = pgTable("market_alerts", {
  id: serial("id").primaryKey(),
  type: alertTypeEnum("type").notNull(),
  commodity: text("commodity").notNull(),
  message: text("message").notNull(),
  severity: alertSeverityEnum("severity").notNull(),
  region: text("region").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCommoditySchema = createInsertSchema(commoditiesTable).omit({ id: true, createdAt: true });
export type InsertCommodity = z.infer<typeof insertCommoditySchema>;
export type Commodity = typeof commoditiesTable.$inferSelect;

export const insertBuyerSchema = createInsertSchema(buyersTable).omit({ id: true, createdAt: true });
export type InsertBuyer = z.infer<typeof insertBuyerSchema>;
export type Buyer = typeof buyersTable.$inferSelect;
