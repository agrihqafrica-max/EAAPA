import { Router } from "express";
import { db } from "@workspace/db";
import { countriesTable, regionsTable, countiesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/countries", async (req, res) => {
  try {
    const { isEastAfrica } = req.query as Record<string, string>;
    let results = await db.select().from(countriesTable);
    if (isEastAfrica === "true") results = results.filter(c => c.isEastAfrica);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing countries");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/regions", async (req, res) => {
  try {
    const { countryId } = req.query as Record<string, string>;
    let results = await db.select().from(regionsTable);
    if (countryId) results = results.filter(r => r.countryId === parseInt(countryId));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing regions");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/counties", async (req, res) => {
  try {
    const { regionId } = req.query as Record<string, string>;
    let results = await db.select().from(countiesTable);
    if (regionId) results = results.filter(c => c.regionId === parseInt(regionId));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing counties");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
