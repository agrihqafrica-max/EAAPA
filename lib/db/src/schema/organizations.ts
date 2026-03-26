import { pgTable, serial, text, boolean, timestamp, integer, numeric, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const companyTypeEnum = pgEnum("company_type", ["agribusiness", "processor", "exporter", "retailer", "fintech", "logistics", "cooperative", "ngo", "research", "government"]);
export const partnershipTypeEnum = pgEnum("partnership_type", ["mou", "strategic", "technical", "financial", "distribution"]);
export const clusterStatusEnum = pgEnum("cluster_status", ["active", "forming", "inactive"]);

export const companiesTable = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: companyTypeEnum("type").notNull().default("agribusiness"),
  description: text("description"),
  logoUrl: text("logo_url"),
  website: text("website"),
  email: text("email"),
  phone: text("phone"),
  country: text("country").notNull().default("Kenya"),
  region: text("region"),
  city: text("city"),
  address: text("address"),
  registrationNumber: text("registration_number"),
  taxId: text("tax_id"),
  yearFounded: integer("year_founded"),
  employeeCount: integer("employee_count").default(0),
  annualRevenueUsd: numeric("annual_revenue_usd"),
  commodities: jsonb("commodities").$type<string[]>().default([]),
  certifications: jsonb("certifications").$type<string[]>().default([]),
  isVerified: boolean("is_verified").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const businessProfilesTable = pgTable("business_profiles", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companiesTable.id, { onDelete: "cascade" }).unique(),
  missionStatement: text("mission_statement"),
  visionStatement: text("vision_statement"),
  keyProducts: jsonb("key_products").$type<string[]>().default([]),
  targetMarkets: jsonb("target_markets").$type<string[]>().default([]),
  uniqueValueProp: text("unique_value_prop"),
  exportMarkets: jsonb("export_markets").$type<string[]>().default([]),
  operatingCountries: jsonb("operating_countries").$type<string[]>().default([]),
  socialImpact: text("social_impact"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const companyUsersTable = pgTable("company_users", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companiesTable.id, { onDelete: "cascade" }),
  memberId: integer("member_id").notNull(),
  roleInCompany: text("role_in_company").notNull().default("employee"),
  isPrimary: boolean("is_primary").notNull().default(false),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const partnershipsTable = pgTable("partnerships", {
  id: serial("id").primaryKey(),
  organizationA: text("organization_a").notNull(),
  organizationB: text("organization_b").notNull(),
  type: partnershipTypeEnum("type").notNull().default("strategic"),
  description: text("description"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(true),
  documents: jsonb("documents").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const clustersTable = pgTable("clusters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  commodity: text("commodity").notNull(),
  region: text("region").notNull(),
  country: text("country").notNull(),
  status: clusterStatusEnum("status").notNull().default("active"),
  memberCount: integer("member_count").notNull().default(0),
  leadOrganization: text("lead_organization"),
  annualOutputTons: numeric("annual_output_tons"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const satelliteCentresTable = pgTable("satellite_centres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  type: text("type").notNull().default("regional"),
  address: text("address"),
  city: text("city").notNull(),
  region: text("region").notNull(),
  country: text("country").notNull(),
  managerName: text("manager_name"),
  managerPhone: text("manager_phone"),
  managerEmail: text("manager_email"),
  services: jsonb("services").$type<string[]>().default([]),
  memberCount: integer("member_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  lat: text("lat"),
  lng: text("lng"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const locationsTable = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("office"),
  address: text("address"),
  city: text("city").notNull(),
  region: text("region"),
  country: text("country").notNull(),
  phone: text("phone"),
  email: text("email"),
  isHeadquarters: boolean("is_headquarters").notNull().default(false),
  lat: text("lat"),
  lng: text("lng"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companiesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companiesTable.$inferSelect;

export const insertClusterSchema = createInsertSchema(clustersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCluster = z.infer<typeof insertClusterSchema>;
export type Cluster = typeof clustersTable.$inferSelect;

export const insertSatelliteCentreSchema = createInsertSchema(satelliteCentresTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSatelliteCentre = z.infer<typeof insertSatelliteCentreSchema>;
export type SatelliteCentre = typeof satelliteCentresTable.$inferSelect;
