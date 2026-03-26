import { pgTable, serial, text, boolean, timestamp, integer, numeric, jsonb, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const farmingSystemEnum = pgEnum("farming_system", ["conventional", "organic", "integrated", "hydroponic", "greenhouse", "open_field"]);
export const seasonEnum = pgEnum("season", ["long_rains", "short_rains", "dry_season", "irrigation"]);
export const productionStatusEnum = pgEnum("production_status", ["planning", "planted", "growing", "harvesting", "post_harvest", "sold"]);

export const commodityCategoriesTable = pgTable("commodity_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  parentCategory: text("parent_category"),
  iconName: text("icon_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const varietiesTable = pgTable("varieties", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  avgYieldPerAcre: numeric("avg_yield_per_acre"),
  maturityDays: integer("maturity_days"),
  diseaseResistance: text("disease_resistance"),
  marketPreference: text("market_preference"),
  isExportGrade: boolean("is_export_grade").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const specificationsTable = pgTable("specifications", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id").notNull(),
  parameterName: text("parameter_name").notNull(),
  minValue: text("min_value"),
  maxValue: text("max_value"),
  unit: text("unit"),
  standard: text("standard"),
  isExportRequirement: boolean("is_export_requirement").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const farmPlotsTable = pgTable("farm_plots", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  plotName: text("plot_name").notNull(),
  plotCode: text("plot_code"),
  sizeAcres: numeric("size_acres").notNull(),
  farmingSystem: farmingSystemEnum("farming_system").notNull().default("conventional"),
  soilType: text("soil_type"),
  irrigationType: text("irrigation_type"),
  region: text("region").notNull(),
  county: text("county"),
  country: text("country").notNull().default("Kenya"),
  lat: text("lat"),
  lng: text("lng"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productionRecordsTable = pgTable("production_records", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  farmPlotId: integer("farm_plot_id").references(() => farmPlotsTable.id),
  commodityId: integer("commodity_id").notNull(),
  varietyId: integer("variety_id").references(() => varietiesTable.id),
  season: seasonEnum("season").notNull().default("long_rains"),
  year: integer("year").notNull(),
  plantedDate: date("planted_date"),
  harvestDate: date("harvest_date"),
  expectedYieldTons: numeric("expected_yield_tons"),
  actualYieldTons: numeric("actual_yield_tons"),
  acreasPlanted: numeric("acreas_planted"),
  qualityGrade: text("quality_grade"),
  status: productionStatusEnum("status").notNull().default("planning"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const inputUsageTable = pgTable("input_usage", {
  id: serial("id").primaryKey(),
  productionRecordId: integer("production_record_id").references(() => productionRecordsTable.id),
  memberId: integer("member_id").notNull(),
  inputType: text("input_type").notNull(),
  inputName: text("input_name").notNull(),
  quantity: numeric("quantity").notNull(),
  unit: text("unit").notNull().default("kg"),
  costPerUnit: numeric("cost_per_unit"),
  totalCost: numeric("total_cost"),
  supplier: text("supplier"),
  appliedDate: date("applied_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const seasonalCyclesTable = pgTable("seasonal_cycles", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id").notNull(),
  region: text("region").notNull(),
  country: text("country").notNull().default("Kenya"),
  plantingMonths: jsonb("planting_months").$type<string[]>().default([]),
  harvestMonths: jsonb("harvest_months").$type<string[]>().default([]),
  peakPriceMonths: jsonb("peak_price_months").$type<string[]>().default([]),
  lowPriceMonths: jsonb("low_price_months").$type<string[]>().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFarmPlotSchema = createInsertSchema(farmPlotsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertFarmPlot = z.infer<typeof insertFarmPlotSchema>;
export type FarmPlot = typeof farmPlotsTable.$inferSelect;

export const insertProductionRecordSchema = createInsertSchema(productionRecordsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProductionRecord = z.infer<typeof insertProductionRecordSchema>;
export type ProductionRecord = typeof productionRecordsTable.$inferSelect;
