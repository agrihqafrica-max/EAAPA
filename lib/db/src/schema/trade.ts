import { pgTable, serial, text, boolean, timestamp, integer, numeric, jsonb, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const listingStatusEnum = pgEnum("listing_status", ["draft", "active", "sold", "expired", "cancelled"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]);
export const contractTypeEnum = pgEnum("contract_type", ["fixed", "flexible", "dynamic", "spot", "forward"]);
export const contractStatusEnum = pgEnum("contract_status", ["draft", "negotiating", "signed", "active", "completed", "disputed", "terminated"]);
export const executionModeEnum = pgEnum("execution_mode", ["manual", "semi_auto", "auto"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["sale", "purchase", "transfer", "refund", "fee", "commission"]);

export const tradeListingsTable = pgTable("trade_listings", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(),
  commodityId: integer("commodity_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  quantity: numeric("quantity").notNull(),
  unit: text("unit").notNull().default("tons"),
  pricePerUnit: numeric("price_per_unit").notNull(),
  currency: text("currency").notNull().default("KES"),
  minOrderQuantity: numeric("min_order_quantity"),
  availableFrom: date("available_from"),
  availableUntil: date("available_until"),
  qualityGrade: text("quality_grade"),
  certifications: jsonb("certifications").$type<string[]>().default([]),
  location: text("location").notNull(),
  country: text("country").notNull().default("Kenya"),
  isExport: boolean("is_export").notNull().default(false),
  isOrganic: boolean("is_organic").notNull().default(false),
  status: listingStatusEnum("status").notNull().default("active"),
  views: integer("views").notNull().default(0),
  inquiries: integer("inquiries").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const listingMediaTable = pgTable("listing_media", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull().references(() => tradeListingsTable.id, { onDelete: "cascade" }),
  mediaType: text("media_type").notNull().default("image"),
  url: text("url").notNull(),
  caption: text("caption"),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  buyerId: integer("buyer_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  listingId: integer("listing_id").references(() => tradeListingsTable.id),
  orderNumber: text("order_number").notNull().unique(),
  status: orderStatusEnum("status").notNull().default("pending"),
  totalAmount: numeric("total_amount").notNull(),
  currency: text("currency").notNull().default("KES"),
  deliveryAddress: text("delivery_address"),
  deliveryDate: date("delivery_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => ordersTable.id, { onDelete: "cascade" }),
  commodityId: integer("commodity_id").notNull(),
  commodityName: text("commodity_name").notNull(),
  quantity: numeric("quantity").notNull(),
  unit: text("unit").notNull().default("tons"),
  unitPrice: numeric("unit_price").notNull(),
  totalPrice: numeric("total_price").notNull(),
  qualityGrade: text("quality_grade"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => ordersTable.id),
  fromPartyId: integer("from_party_id").notNull(),
  toPartyId: integer("to_party_id").notNull(),
  type: transactionTypeEnum("type").notNull().default("sale"),
  amount: numeric("amount").notNull(),
  currency: text("currency").notNull().default("KES"),
  exchangeRate: numeric("exchange_rate"),
  amountUsd: numeric("amount_usd"),
  reference: text("reference"),
  paymentMethod: text("payment_method"),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contractsTable = pgTable("contracts", {
  id: serial("id").primaryKey(),
  buyerId: integer("buyer_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  commodityId: integer("commodity_id"),
  commodityName: text("commodity_name").notNull(),
  contractNumber: text("contract_number").notNull().unique(),
  type: contractTypeEnum("type").notNull().default("fixed"),
  executionMode: executionModeEnum("execution_mode").notNull().default("manual"),
  quantity: numeric("quantity").notNull(),
  unit: text("unit").notNull().default("tons"),
  pricePerUnit: numeric("price_per_unit").notNull(),
  currency: text("currency").notNull().default("USD"),
  totalValue: numeric("total_value").notNull(),
  startDate: date("start_date"),
  endDate: date("end_date"),
  deliveryTerms: text("delivery_terms"),
  paymentTerms: text("payment_terms"),
  qualitySpec: text("quality_spec"),
  status: contractStatusEnum("status").notNull().default("draft"),
  signedAt: timestamp("signed_at"),
  documentUrl: text("document_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const pricingModelsTable = pgTable("pricing_models", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull().default("fixed"),
  basePrice: numeric("base_price").notNull(),
  currency: text("currency").notNull().default("KES"),
  qualityAdjustments: jsonb("quality_adjustments").$type<Record<string, number>>().default({}),
  seasonalFactors: jsonb("seasonal_factors").$type<Record<string, number>>().default({}),
  volumeDiscounts: jsonb("volume_discounts").$type<Array<{ minTons: number; discountPercent: number }>>().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const bulkRequestsTable = pgTable("bulk_requests", {
  id: serial("id").primaryKey(),
  buyerId: integer("buyer_id").notNull(),
  commodityId: integer("commodity_id"),
  commodityName: text("commodity_name").notNull(),
  quantityTons: numeric("quantity_tons").notNull(),
  pricePerTon: numeric("price_per_ton"),
  currency: text("currency").notNull().default("USD"),
  requiredBy: date("required_by"),
  qualitySpec: text("quality_spec"),
  certificationRequired: jsonb("certification_required").$type<string[]>().default([]),
  deliveryLocation: text("delivery_location"),
  isOpen: boolean("is_open").notNull().default(true),
  responses: integer("responses").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTradeListingSchema = createInsertSchema(tradeListingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTradeListing = z.infer<typeof insertTradeListingSchema>;
export type TradeListing = typeof tradeListingsTable.$inferSelect;

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;

export const insertContractSchema = createInsertSchema(contractsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contractsTable.$inferSelect;

export const insertBulkRequestSchema = createInsertSchema(bulkRequestsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBulkRequest = z.infer<typeof insertBulkRequestSchema>;
export type BulkRequest = typeof bulkRequestsTable.$inferSelect;
