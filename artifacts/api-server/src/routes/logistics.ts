import { Router } from "express";
import { db } from "@workspace/db";
import { shipmentsTable, warehousesTable, inventoryTable, inventoryMovementsTable, logisticsProvidersTable, deliveryTrackingTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

// Shipments
router.get("/shipments", async (req, res) => {
  try {
    const { status, originCountry, destinationCountry } = req.query as Record<string, string>;
    let results = await db.select().from(shipmentsTable).orderBy(desc(shipmentsTable.createdAt));
    if (status) results = results.filter(s => s.status === status);
    if (originCountry) results = results.filter(s => s.originCountry.toLowerCase() === originCountry.toLowerCase());
    if (destinationCountry) results = results.filter(s => s.destinationCountry.toLowerCase() === destinationCountry.toLowerCase());
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing shipments");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/shipments/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [shipment] = await db.select().from(shipmentsTable).where(eq(shipmentsTable.id, id));
    if (!shipment) return res.status(404).json({ error: "Shipment not found" });
    const tracking = await db.select().from(deliveryTrackingTable).where(eq(deliveryTrackingTable.shipmentId, id));
    res.json({ ...shipment, tracking });
  } catch (err) {
    req.log.error({ err }, "Error getting shipment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/shipments", async (req, res) => {
  try {
    const shipmentNumber = `SHP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const [shipment] = await db.insert(shipmentsTable).values({ ...req.body, shipmentNumber }).returning();
    res.status(201).json(shipment);
  } catch (err) {
    req.log.error({ err }, "Error creating shipment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/shipments/:id/status", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, location, description } = req.body;
    const [shipment] = await db.update(shipmentsTable).set({ status, updatedAt: new Date() }).where(eq(shipmentsTable.id, id)).returning();
    if (!shipment) return res.status(404).json({ error: "Shipment not found" });
    await db.insert(deliveryTrackingTable).values({ shipmentId: id, status, location, description });
    res.json(shipment);
  } catch (err) {
    req.log.error({ err }, "Error updating shipment status");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Warehouses
router.get("/warehouses", async (req, res) => {
  try {
    const { type, country, region } = req.query as Record<string, string>;
    let results = await db.select().from(warehousesTable);
    if (type) results = results.filter(w => w.type === type);
    if (country) results = results.filter(w => w.country.toLowerCase() === country.toLowerCase());
    if (region) results = results.filter(w => w.region.toLowerCase().includes(region.toLowerCase()));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing warehouses");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/warehouses/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [warehouse] = await db.select().from(warehousesTable).where(eq(warehousesTable.id, id));
    if (!warehouse) return res.status(404).json({ error: "Warehouse not found" });
    const inventory = await db.select().from(inventoryTable).where(eq(inventoryTable.warehouseId, id));
    res.json({ ...warehouse, inventory });
  } catch (err) {
    req.log.error({ err }, "Error getting warehouse");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/warehouses", async (req, res) => {
  try {
    const [warehouse] = await db.insert(warehousesTable).values(req.body).returning();
    res.status(201).json(warehouse);
  } catch (err) {
    req.log.error({ err }, "Error creating warehouse");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Inventory
router.get("/inventory", async (req, res) => {
  try {
    const { warehouseId, ownerId, status, commodityName } = req.query as Record<string, string>;
    let results = await db.select().from(inventoryTable).orderBy(desc(inventoryTable.createdAt));
    if (warehouseId) results = results.filter(i => i.warehouseId === parseInt(warehouseId));
    if (ownerId) results = results.filter(i => i.ownerId === parseInt(ownerId));
    if (status) results = results.filter(i => i.status === status);
    if (commodityName) results = results.filter(i => i.commodityName.toLowerCase().includes(commodityName.toLowerCase()));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing inventory");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/inventory", async (req, res) => {
  try {
    const [entry] = await db.insert(inventoryTable).values(req.body).returning();
    await db.insert(inventoryMovementsTable).values({
      inventoryId: entry.id,
      movementType: "in",
      quantity: entry.quantity,
      toLocation: `Warehouse ${entry.warehouseId}`,
    });
    res.status(201).json(entry);
  } catch (err) {
    req.log.error({ err }, "Error adding inventory");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/inventory/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [entry] = await db.update(inventoryTable).set({ ...req.body, updatedAt: new Date() }).where(eq(inventoryTable.id, id)).returning();
    if (!entry) return res.status(404).json({ error: "Inventory entry not found" });
    res.json(entry);
  } catch (err) {
    req.log.error({ err }, "Error updating inventory");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logistics Providers
router.get("/logistics-providers", async (req, res) => {
  try {
    const { type } = req.query as Record<string, string>;
    let results = await db.select().from(logisticsProvidersTable);
    if (type) results = results.filter(p => p.type === type);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing logistics providers");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logistics-providers", async (req, res) => {
  try {
    const [provider] = await db.insert(logisticsProvidersTable).values(req.body).returning();
    res.status(201).json(provider);
  } catch (err) {
    req.log.error({ err }, "Error creating logistics provider");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
