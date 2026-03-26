import { Router } from "express";
import { db } from "@workspace/db";
import { companiesTable, businessProfilesTable, clustersTable, satelliteCentresTable, locationsTable, partnershipsTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";

const router = Router();

// Companies
router.get("/companies", async (req, res) => {
  try {
    const { type, sector, country, verified } = req.query as Record<string, string>;
    let results = await db.select().from(companiesTable);
    if (type) results = results.filter(c => c.type === type);
    if (country) results = results.filter(c => c.country.toLowerCase().includes(country.toLowerCase()));
    if (verified === "true") results = results.filter(c => c.isVerified);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing companies");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/companies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, id));
    if (!company) return res.status(404).json({ error: "Company not found" });
    const [profile] = await db.select().from(businessProfilesTable).where(eq(businessProfilesTable.companyId, id));
    res.json({ ...company, profile: profile || null });
  } catch (err) {
    req.log.error({ err }, "Error getting company");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/companies", async (req, res) => {
  try {
    const [company] = await db.insert(companiesTable).values(req.body).returning();
    res.status(201).json(company);
  } catch (err) {
    req.log.error({ err }, "Error creating company");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/companies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [company] = await db.update(companiesTable).set({ ...req.body, updatedAt: new Date() }).where(eq(companiesTable.id, id)).returning();
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.json(company);
  } catch (err) {
    req.log.error({ err }, "Error updating company");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Clusters
router.get("/clusters", async (req, res) => {
  try {
    const { commodity, country, status } = req.query as Record<string, string>;
    let results = await db.select().from(clustersTable);
    if (commodity) results = results.filter(c => c.commodity.toLowerCase().includes(commodity.toLowerCase()));
    if (country) results = results.filter(c => c.country.toLowerCase() === country.toLowerCase());
    if (status) results = results.filter(c => c.status === status);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing clusters");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/clusters/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [cluster] = await db.select().from(clustersTable).where(eq(clustersTable.id, id));
    if (!cluster) return res.status(404).json({ error: "Cluster not found" });
    res.json(cluster);
  } catch (err) {
    req.log.error({ err }, "Error getting cluster");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/clusters", async (req, res) => {
  try {
    const [cluster] = await db.insert(clustersTable).values(req.body).returning();
    res.status(201).json(cluster);
  } catch (err) {
    req.log.error({ err }, "Error creating cluster");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Satellite Centres
router.get("/satellite-centres", async (req, res) => {
  try {
    const { country, region } = req.query as Record<string, string>;
    let results = await db.select().from(satelliteCentresTable);
    if (country) results = results.filter(s => s.country.toLowerCase() === country.toLowerCase());
    if (region) results = results.filter(s => s.region.toLowerCase().includes(region.toLowerCase()));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing satellite centres");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/satellite-centres/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [centre] = await db.select().from(satelliteCentresTable).where(eq(satelliteCentresTable.id, id));
    if (!centre) return res.status(404).json({ error: "Satellite centre not found" });
    res.json(centre);
  } catch (err) {
    req.log.error({ err }, "Error getting satellite centre");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Locations (offices)
router.get("/locations", async (req, res) => {
  try {
    const results = await db.select().from(locationsTable);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing locations");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Partnerships
router.get("/partnerships", async (req, res) => {
  try {
    const results = await db.select().from(partnershipsTable).where(eq(partnershipsTable.isActive, true));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing partnerships");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
