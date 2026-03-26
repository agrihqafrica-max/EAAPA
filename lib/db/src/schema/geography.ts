import { pgTable, serial, text, boolean, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const countriesTable = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  continent: text("continent").notNull().default("Africa"),
  currency: text("currency"),
  currencyCode: text("currency_code"),
  dialCode: text("dial_code"),
  flagEmoji: text("flag_emoji"),
  isEastAfrica: boolean("is_east_africa").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const regionsTable = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  countryId: integer("country_id").notNull().references(() => countriesTable.id),
  code: text("code"),
  type: text("type").notNull().default("region"),
  population: integer("population"),
  areaKm2: numeric("area_km2"),
  isAgricultural: boolean("is_agricultural").notNull().default(true),
  mainCommodities: text("main_commodities"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const countiesTable = pgTable("counties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  regionId: integer("region_id").notNull().references(() => regionsTable.id),
  code: text("code"),
  headquarters: text("headquarters"),
  population: integer("population"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subCountiesTable = pgTable("sub_counties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  countyId: integer("county_id").notNull().references(() => countiesTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const wardsTable = pgTable("wards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subCountyId: integer("sub_county_id").notNull().references(() => subCountiesTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const geoCoordinatesTable = pgTable("geo_coordinates", {
  id: serial("id").primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  lat: numeric("lat").notNull(),
  lng: numeric("lng").notNull(),
  altitude: numeric("altitude"),
  accuracy: numeric("accuracy"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCountrySchema = createInsertSchema(countriesTable).omit({ id: true, createdAt: true });
export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Country = typeof countriesTable.$inferSelect;

export const insertRegionSchema = createInsertSchema(regionsTable).omit({ id: true, createdAt: true });
export type InsertRegion = z.infer<typeof insertRegionSchema>;
export type Region = typeof regionsTable.$inferSelect;
