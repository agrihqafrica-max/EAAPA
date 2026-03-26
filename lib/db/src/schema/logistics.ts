import { pgTable, serial, text, boolean, timestamp, integer, numeric, jsonb, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const shipmentStatusEnum = pgEnum("shipment_status", ["pending", "dispatched", "in_transit", "at_port", "customs", "delivered", "returned", "lost"]);
export const warehouseTypeEnum = pgEnum("warehouse_type", ["cold_chain", "dry_storage", "processing", "packaging", "distribution"]);
export const inventoryStatusEnum = pgEnum("inventory_status", ["in_stock", "reserved", "sold", "damaged", "expired"]);

export const shipmentsTable = pgTable("shipments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id"),
  sellerId: integer("seller_id").notNull(),
  buyerId: integer("buyer_id").notNull(),
  commodityId: integer("commodity_id"),
  commodityName: text("commodity_name").notNull(),
  shipmentNumber: text("shipment_number").notNull().unique(),
  quantity: numeric("quantity").notNull(),
  unit: text("unit").notNull().default("tons"),
  originLocation: text("origin_location").notNull(),
  originCountry: text("origin_country").notNull().default("Kenya"),
  destinationLocation: text("destination_location").notNull(),
  destinationCountry: text("destination_country").notNull(),
  status: shipmentStatusEnum("status").notNull().default("pending"),
  carrier: text("carrier"),
  trackingNumber: text("tracking_number"),
  dispatchDate: date("dispatch_date"),
  expectedDelivery: date("expected_delivery"),
  actualDelivery: date("actual_delivery"),
  freightCost: numeric("freight_cost"),
  currency: text("currency").notNull().default("USD"),
  incoterms: text("incoterms"),
  documents: jsonb("documents").$type<string[]>().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const shipmentItemsTable = pgTable("shipment_items", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").notNull().references(() => shipmentsTable.id, { onDelete: "cascade" }),
  commodityId: integer("commodity_id").notNull(),
  commodityName: text("commodity_name").notNull(),
  quantity: numeric("quantity").notNull(),
  unit: text("unit").notNull().default("tons"),
  weight: numeric("weight"),
  volume: numeric("volume"),
  packagingType: text("packaging_type"),
  lotNumber: text("lot_number"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const warehousesTable = pgTable("warehouses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  type: warehouseTypeEnum("type").notNull().default("dry_storage"),
  address: text("address"),
  city: text("city").notNull(),
  region: text("region").notNull(),
  country: text("country").notNull().default("Kenya"),
  capacityTons: numeric("capacity_tons"),
  currentOccupancy: numeric("current_occupancy").notNull().default("0"),
  minTemp: numeric("min_temp"),
  maxTemp: numeric("max_temp"),
  operatorName: text("operator_name"),
  operatorPhone: text("operator_phone"),
  certifications: jsonb("certifications").$type<string[]>().default([]),
  isActive: boolean("is_active").notNull().default(true),
  lat: text("lat"),
  lng: text("lng"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const storesTable = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("retail"),
  city: text("city").notNull(),
  region: text("region"),
  country: text("country").notNull().default("Kenya"),
  phone: text("phone"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const inventoryTable = pgTable("inventory", {
  id: serial("id").primaryKey(),
  warehouseId: integer("warehouse_id").notNull().references(() => warehousesTable.id),
  ownerId: integer("owner_id").notNull(),
  commodityId: integer("commodity_id").notNull(),
  commodityName: text("commodity_name").notNull(),
  batchNumber: text("batch_number"),
  quantity: numeric("quantity").notNull(),
  unit: text("unit").notNull().default("tons"),
  qualityGrade: text("quality_grade"),
  entryDate: date("entry_date").notNull(),
  expiryDate: date("expiry_date"),
  status: inventoryStatusEnum("status").notNull().default("in_stock"),
  unitCost: numeric("unit_cost"),
  currency: text("currency").notNull().default("KES"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const inventoryMovementsTable = pgTable("inventory_movements", {
  id: serial("id").primaryKey(),
  inventoryId: integer("inventory_id").notNull().references(() => inventoryTable.id),
  movementType: text("movement_type").notNull(),
  quantity: numeric("quantity").notNull(),
  fromLocation: text("from_location"),
  toLocation: text("to_location"),
  reference: text("reference"),
  performedBy: integer("performed_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const logisticsProvidersTable = pgTable("logistics_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("freight_forwarder"),
  coverageCountries: jsonb("coverage_countries").$type<string[]>().default([]),
  services: jsonb("services").$type<string[]>().default([]),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  website: text("website"),
  rating: integer("rating"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const deliveryTrackingTable = pgTable("delivery_tracking", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").notNull().references(() => shipmentsTable.id),
  status: text("status").notNull(),
  location: text("location"),
  lat: text("lat"),
  lng: text("lng"),
  description: text("description"),
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
  recordedBy: integer("recorded_by"),
});

export const insertShipmentSchema = createInsertSchema(shipmentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Shipment = typeof shipmentsTable.$inferSelect;

export const insertWarehouseSchema = createInsertSchema(warehousesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWarehouse = z.infer<typeof insertWarehouseSchema>;
export type Warehouse = typeof warehousesTable.$inferSelect;

export const insertInventorySchema = createInsertSchema(inventoryTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type Inventory = typeof inventoryTable.$inferSelect;
