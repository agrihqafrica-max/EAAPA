import { Router } from "express";
import { db } from "@workspace/db";
import { tradeListingsTable, ordersTable, orderItemsTable, transactionsTable, contractsTable, bulkRequestsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

// Trade Listings
router.get("/trade-listings", async (req, res) => {
  try {
    const { status, isExport, isOrganic, country } = req.query as Record<string, string>;
    let results = await db.select().from(tradeListingsTable).orderBy(desc(tradeListingsTable.createdAt));
    if (status) results = results.filter(l => l.status === status);
    if (isExport === "true") results = results.filter(l => l.isExport);
    if (isOrganic === "true") results = results.filter(l => l.isOrganic);
    if (country) results = results.filter(l => l.country.toLowerCase() === country.toLowerCase());
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing trade listings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/trade-listings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [listing] = await db.select().from(tradeListingsTable).where(eq(tradeListingsTable.id, id));
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    await db.update(tradeListingsTable).set({ views: listing.views + 1 }).where(eq(tradeListingsTable.id, id));
    res.json({ ...listing, views: listing.views + 1 });
  } catch (err) {
    req.log.error({ err }, "Error getting listing");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/trade-listings", async (req, res) => {
  try {
    const [listing] = await db.insert(tradeListingsTable).values(req.body).returning();
    res.status(201).json(listing);
  } catch (err) {
    req.log.error({ err }, "Error creating listing");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/trade-listings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [listing] = await db.update(tradeListingsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(tradeListingsTable.id, id)).returning();
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (err) {
    req.log.error({ err }, "Error updating listing");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/trade-listings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.update(tradeListingsTable).set({ status: "cancelled", updatedAt: new Date() }).where(eq(tradeListingsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Error deleting listing");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Orders
router.get("/orders", async (req, res) => {
  try {
    const { buyerId, sellerId, status } = req.query as Record<string, string>;
    let results = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
    if (buyerId) results = results.filter(o => o.buyerId === parseInt(buyerId));
    if (sellerId) results = results.filter(o => o.sellerId === parseInt(sellerId));
    if (status) results = results.filter(o => o.status === status);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) return res.status(404).json({ error: "Order not found" });
    const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, id));
    res.json({ ...order, items });
  } catch (err) {
    req.log.error({ err }, "Error getting order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const { items, ...orderData } = req.body;
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const [order] = await db.insert(ordersTable).values({ ...orderData, orderNumber }).returning();
    if (items?.length) {
      await db.insert(orderItemsTable).values(items.map((item: any) => ({ ...item, orderId: order.id })));
    }
    res.status(201).json(order);
  } catch (err) {
    req.log.error({ err }, "Error creating order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/orders/:id/status", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const [order] = await db.update(ordersTable).set({ status, updatedAt: new Date() }).where(eq(ordersTable.id, id)).returning();
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    req.log.error({ err }, "Error updating order status");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Contracts
router.get("/contracts", async (req, res) => {
  try {
    const { buyerId, sellerId, status, type } = req.query as Record<string, string>;
    let results = await db.select().from(contractsTable).orderBy(desc(contractsTable.createdAt));
    if (buyerId) results = results.filter(c => c.buyerId === parseInt(buyerId));
    if (sellerId) results = results.filter(c => c.sellerId === parseInt(sellerId));
    if (status) results = results.filter(c => c.status === status);
    if (type) results = results.filter(c => c.type === type);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing contracts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/contracts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [contract] = await db.select().from(contractsTable).where(eq(contractsTable.id, id));
    if (!contract) return res.status(404).json({ error: "Contract not found" });
    res.json(contract);
  } catch (err) {
    req.log.error({ err }, "Error getting contract");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/contracts", async (req, res) => {
  try {
    const contractNumber = `CTR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const [contract] = await db.insert(contractsTable).values({ ...req.body, contractNumber }).returning();
    res.status(201).json(contract);
  } catch (err) {
    req.log.error({ err }, "Error creating contract");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/contracts/:id/sign", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [contract] = await db.update(contractsTable).set({ status: "signed", signedAt: new Date(), updatedAt: new Date() }).where(eq(contractsTable.id, id)).returning();
    if (!contract) return res.status(404).json({ error: "Contract not found" });
    res.json(contract);
  } catch (err) {
    req.log.error({ err }, "Error signing contract");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Transactions
router.get("/transactions", async (req, res) => {
  try {
    const { type, status } = req.query as Record<string, string>;
    let results = await db.select().from(transactionsTable).orderBy(desc(transactionsTable.createdAt));
    if (type) results = results.filter(t => t.type === type);
    if (status) results = results.filter(t => t.status === status);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing transactions");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/transactions", async (req, res) => {
  try {
    const [transaction] = await db.insert(transactionsTable).values(req.body).returning();
    res.status(201).json(transaction);
  } catch (err) {
    req.log.error({ err }, "Error creating transaction");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Bulk Requests
router.get("/bulk-requests", async (req, res) => {
  try {
    const { isOpen } = req.query as Record<string, string>;
    let results = await db.select().from(bulkRequestsTable).orderBy(desc(bulkRequestsTable.createdAt));
    if (isOpen === "true") results = results.filter(r => r.isOpen);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing bulk requests");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/bulk-requests", async (req, res) => {
  try {
    const [request] = await db.insert(bulkRequestsTable).values(req.body).returning();
    res.status(201).json(request);
  } catch (err) {
    req.log.error({ err }, "Error creating bulk request");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
