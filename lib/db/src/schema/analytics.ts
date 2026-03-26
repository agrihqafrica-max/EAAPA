import { pgTable, serial, text, boolean, timestamp, integer, numeric, jsonb, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const widgetTypeEnum = pgEnum("widget_type", ["kpi_card", "line_chart", "bar_chart", "pie_chart", "table", "map", "gauge", "heatmap"]);
export const reportTypeEnum = pgEnum("report_type", ["market", "financial", "impact", "membership", "operations", "custom"]);
export const kpiCategoryEnum = pgEnum("kpi_category", ["membership", "financial", "impact", "market", "training", "engagement"]);

export const dashboardsTable = pgTable("dashboards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  role: text("role").notNull().default("admin"),
  layout: jsonb("layout").$type<Record<string, any>>().default({}),
  isDefault: boolean("is_default").notNull().default(false),
  isPublic: boolean("is_public").notNull().default(false),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const dashboardWidgetsTable = pgTable("dashboard_widgets", {
  id: serial("id").primaryKey(),
  dashboardId: integer("dashboard_id").notNull().references(() => dashboardsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: widgetTypeEnum("type").notNull().default("kpi_card"),
  dataSource: text("data_source").notNull(),
  config: jsonb("config").$type<Record<string, any>>().default({}),
  position: jsonb("position").$type<{ x: number; y: number; w: number; h: number }>().default({ x: 0, y: 0, w: 3, h: 2 }),
  refreshIntervalSec: integer("refresh_interval_sec").default(300),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const marketDataTable = pgTable("market_data", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id"),
  commodityName: text("commodity_name").notNull(),
  source: text("source").notNull(),
  priceUsd: numeric("price_usd").notNull(),
  priceLocal: numeric("price_local"),
  currency: text("currency"),
  marketType: text("market_type").notNull().default("local"),
  location: text("location"),
  country: text("country").notNull().default("Kenya"),
  volumeTons: numeric("volume_tons"),
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const demandSignalsTable = pgTable("demand_signals", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id"),
  commodityName: text("commodity_name").notNull(),
  signal: text("signal").notNull(),
  strength: integer("strength").notNull().default(50),
  source: text("source"),
  market: text("market"),
  country: text("country"),
  description: text("description"),
  validUntil: date("valid_until"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const supplySignalsTable = pgTable("supply_signals", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id"),
  commodityName: text("commodity_name").notNull(),
  signal: text("signal").notNull(),
  strength: integer("strength").notNull().default(50),
  source: text("source"),
  region: text("region"),
  country: text("country"),
  description: text("description"),
  validUntil: date("valid_until"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const priceTrendsTable = pgTable("price_trends", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id").notNull(),
  commodityName: text("commodity_name").notNull(),
  period: text("period").notNull(),
  avgPrice: numeric("avg_price").notNull(),
  minPrice: numeric("min_price"),
  maxPrice: numeric("max_price"),
  currency: text("currency").notNull().default("KES"),
  volumeTons: numeric("volume_tons"),
  country: text("country").notNull().default("Kenya"),
  source: text("source"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const impactMetricsTable = pgTable("impact_metrics", {
  id: serial("id").primaryKey(),
  metric: text("metric").notNull(),
  category: kpiCategoryEnum("category").notNull().default("impact"),
  value: numeric("value").notNull(),
  unit: text("unit"),
  period: text("period").notNull(),
  region: text("region"),
  country: text("country"),
  notes: text("notes"),
  recordedAt: date("recorded_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const kpisTable = pgTable("kpis", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: kpiCategoryEnum("category").notNull().default("membership"),
  description: text("description"),
  currentValue: numeric("current_value").notNull().default("0"),
  targetValue: numeric("target_value"),
  unit: text("unit"),
  period: text("period").notNull().default("monthly"),
  trend: text("trend").notNull().default("up"),
  percentageChange: numeric("percentage_change"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reportsTable = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: reportTypeEnum("type").notNull().default("market"),
  description: text("description"),
  period: text("period"),
  generatedBy: integer("generated_by"),
  parameters: jsonb("parameters").$type<Record<string, any>>().default({}),
  filePath: text("file_path"),
  status: text("status").notNull().default("ready"),
  isScheduled: boolean("is_scheduled").notNull().default(false),
  schedule: text("schedule"),
  lastRanAt: timestamp("last_ran_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertKpiSchema = createInsertSchema(kpisTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertKpi = z.infer<typeof insertKpiSchema>;
export type Kpi = typeof kpisTable.$inferSelect;

export const insertReportSchema = createInsertSchema(reportsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reportsTable.$inferSelect;
