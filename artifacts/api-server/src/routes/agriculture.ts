import { Router } from "express";
import { db } from "@workspace/db";
import { farmPlotsTable, productionRecordsTable, inputUsageTable, varietiesTable, seasonalCyclesTable, commodityCategoriesTable, specificationsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

// Commodity Categories
router.get("/commodity-categories", async (req, res) => {
  try {
    const results = await db.select().from(commodityCategoriesTable);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing commodity categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Varieties
router.get("/varieties", async (req, res) => {
  try {
    const { commodityId } = req.query as Record<string, string>;
    let results = await db.select().from(varietiesTable);
    if (commodityId) results = results.filter(v => v.commodityId === parseInt(commodityId));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing varieties");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/varieties", async (req, res) => {
  try {
    const [variety] = await db.insert(varietiesTable).values(req.body).returning();
    res.status(201).json(variety);
  } catch (err) {
    req.log.error({ err }, "Error creating variety");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Farm Plots
router.get("/farm-plots", async (req, res) => {
  try {
    const { memberId, country } = req.query as Record<string, string>;
    let results = await db.select().from(farmPlotsTable);
    if (memberId) results = results.filter(p => p.memberId === parseInt(memberId));
    if (country) results = results.filter(p => p.country.toLowerCase() === country.toLowerCase());
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing farm plots");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/farm-plots/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [plot] = await db.select().from(farmPlotsTable).where(eq(farmPlotsTable.id, id));
    if (!plot) return res.status(404).json({ error: "Farm plot not found" });
    res.json(plot);
  } catch (err) {
    req.log.error({ err }, "Error getting farm plot");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/farm-plots", async (req, res) => {
  try {
    const [plot] = await db.insert(farmPlotsTable).values(req.body).returning();
    res.status(201).json(plot);
  } catch (err) {
    req.log.error({ err }, "Error creating farm plot");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/farm-plots/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [plot] = await db.update(farmPlotsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(farmPlotsTable.id, id)).returning();
    if (!plot) return res.status(404).json({ error: "Farm plot not found" });
    res.json(plot);
  } catch (err) {
    req.log.error({ err }, "Error updating farm plot");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/farm-plots/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(farmPlotsTable).where(eq(farmPlotsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Error deleting farm plot");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Production Records
router.get("/production-records", async (req, res) => {
  try {
    const { memberId, commodityId, year, status } = req.query as Record<string, string>;
    let results = await db.select().from(productionRecordsTable);
    if (memberId) results = results.filter(r => r.memberId === parseInt(memberId));
    if (commodityId) results = results.filter(r => r.commodityId === parseInt(commodityId));
    if (year) results = results.filter(r => r.year === parseInt(year));
    if (status) results = results.filter(r => r.status === status);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing production records");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/production-records", async (req, res) => {
  try {
    const [record] = await db.insert(productionRecordsTable).values(req.body).returning();
    res.status(201).json(record);
  } catch (err) {
    req.log.error({ err }, "Error creating production record");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/production-records/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [record] = await db.update(productionRecordsTable).set({ ...req.body, updatedAt: new Date() }).where(eq(productionRecordsTable.id, id)).returning();
    if (!record) return res.status(404).json({ error: "Not found" });
    res.json(record);
  } catch (err) {
    req.log.error({ err }, "Error updating production record");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Input Usage
router.get("/input-usage", async (req, res) => {
  try {
    const { memberId } = req.query as Record<string, string>;
    let results = await db.select().from(inputUsageTable);
    if (memberId) results = results.filter(i => i.memberId === parseInt(memberId));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing input usage");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/input-usage", async (req, res) => {
  try {
    const [entry] = await db.insert(inputUsageTable).values(req.body).returning();
    res.status(201).json(entry);
  } catch (err) {
    req.log.error({ err }, "Error recording input usage");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Seasonal Cycles
router.get("/seasonal-cycles", async (req, res) => {
  try {
    const { commodityId, country } = req.query as Record<string, string>;
    let results = await db.select().from(seasonalCyclesTable);
    if (commodityId) results = results.filter(s => s.commodityId === parseInt(commodityId));
    if (country) results = results.filter(s => s.country.toLowerCase() === country.toLowerCase());
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing seasonal cycles");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Specifications
router.get("/specifications", async (req, res) => {
  try {
    const { commodityId } = req.query as Record<string, string>;
    let results = await db.select().from(specificationsTable);
    if (commodityId) results = results.filter(s => s.commodityId === parseInt(commodityId));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing specifications");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
