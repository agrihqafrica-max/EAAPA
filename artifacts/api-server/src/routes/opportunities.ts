import { Router } from "express";
import { db } from "@workspace/db";
import { opportunitiesTable } from "@workspace/db";
import { eq, ilike } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { type, sector } = req.query as Record<string, string>;
    let opportunities = await db.select().from(opportunitiesTable);
    if (type) opportunities = opportunities.filter((o) => o.type === type);
    if (sector) opportunities = opportunities.filter((o) => o.sector.toLowerCase().includes(sector.toLowerCase()));
    res.json(opportunities.map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description,
      type: o.type,
      sector: o.sector,
      roi: o.roi,
      fundingAmount: o.fundingAmount ? parseFloat(o.fundingAmount) : undefined,
      currency: o.currency,
      deadline: o.deadline,
      status: o.status,
      tags: o.tags as string[],
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing opportunities");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, type, sector, roi, fundingAmount } = req.body;
    const [opp] = await db.insert(opportunitiesTable).values({
      title, description, type, sector, roi, fundingAmount: fundingAmount?.toString(), status: "open"
    }).returning();
    res.status(201).json({ ...opp, fundingAmount: opp.fundingAmount ? parseFloat(opp.fundingAmount) : undefined, tags: [] });
  } catch (err) {
    req.log.error({ err }, "Error creating opportunity");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
