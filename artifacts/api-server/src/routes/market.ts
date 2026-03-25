import { Router } from "express";
import { db } from "@workspace/db";
import { commoditiesTable, priceHistoryTable, buyersTable, marketAlertsTable } from "@workspace/db";
import { eq, and, ilike, gte, lte } from "drizzle-orm";

const router = Router();

const CURRENCY_RATES: Record<string, number> = {
  KES: 1,
  UGX: 28.5,
  TZS: 25.2,
  RWF: 7.8,
  ETB: 5.4,
  USD: 0.0077,
  EUR: 0.0071,
};

router.get("/commodities", async (req, res) => {
  try {
    const { category, region, demandLevel, currency = "KES" } = req.query as Record<string, string>;
    const conditions = [];
    if (category) conditions.push(ilike(commoditiesTable.category, `%${category}%`));
    if (region) conditions.push(ilike(commoditiesTable.region, `%${region}%`));
    if (demandLevel) conditions.push(eq(commoditiesTable.demandLevel, demandLevel as any));

    const commodities = conditions.length > 0
      ? await db.select().from(commoditiesTable).where(and(...conditions))
      : await db.select().from(commoditiesTable);

    const rate = CURRENCY_RATES[currency] ?? 1;
    const result = commodities.map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category,
      avgPrice: parseFloat(c.avgPrice) * rate,
      currency,
      demandLevel: c.demandLevel,
      marketSizeUsd: parseFloat(c.marketSizeUsd),
      topBuyers: c.topBuyers as string[],
      trend: c.trend,
      marketHealth: c.marketHealth,
      region: c.region,
      isExport: c.isExport,
      isOrganic: c.isOrganic,
      priceChange7d: c.priceChange7d ? parseFloat(c.priceChange7d) : 0,
      priceChange30d: c.priceChange30d ? parseFloat(c.priceChange30d) : 0,
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error listing commodities");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/commodities/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [c] = await db.select().from(commoditiesTable).where(eq(commoditiesTable.id, id));
    if (!c) return res.status(404).json({ error: "Commodity not found" });

    const history = await db.select().from(priceHistoryTable).where(eq(priceHistoryTable.commodityId, id));
    const buyers = await db.select().from(buyersTable);

    res.json({
      id: c.id,
      name: c.name,
      category: c.category,
      overview: {
        globalPrice: parseFloat(c.globalPrice ?? c.avgPrice),
        regionalPrice: parseFloat(c.avgPrice),
        currency: c.currency,
        marketSizeUsd: parseFloat(c.marketSizeUsd),
        demandGrowthPercent: parseFloat(c.demandGrowthPercent ?? "12"),
        importRegions: c.importRegions as string[] ?? [],
        exportRegions: c.exportRegions as string[] ?? [],
      },
      buyers: buyers.slice(0, 10).map((b) => ({
        id: b.id,
        name: b.name,
        location: b.location,
        type: b.type,
        weeklyDemandTons: parseFloat(b.weeklyDemandTons),
        monthlyDemandTons: parseFloat(b.monthlyDemandTons),
        yearlyDemandTons: parseFloat(b.yearlyDemandTons),
        sustainabilityScore: b.sustainabilityScore,
        aiMatchScore: b.aiMatchScore,
        tradeReadiness: b.tradeReadiness,
        currency: b.currency,
        commodities: b.commodities as string[],
        isAiRecommended: b.isAiRecommended,
      })),
      specifications: {
        variety: c.variety ?? "Standard",
        qualityStandards: c.qualityStandards as string[] ?? ["Grade A", "Grade B"],
        packaging: c.packaging as string[] ?? ["Bulk", "Retail Pack"],
        certifications: c.certifications as string[] ?? ["GlobalGAP", "Organic"],
        exportRequirements: c.exportRequirements as string[] ?? ["Phytosanitary Certificate", "Certificate of Origin"],
      },
      logistics: {
        demandByRegion: { "Nairobi": 1200, "Mombasa": 800, "Kampala": 600, "Dar es Salaam": 900 },
        tonsPerYear: parseFloat(c.tonsPerYear ?? "5000"),
        exportRoutes: c.exportRoutes as string[] ?? ["Nairobi → Dubai", "Mombasa → Rotterdam"],
        avgDeliveryDays: c.avgDeliveryDays ?? 14,
        costPerTon: parseFloat(c.costPerTon ?? "250"),
      },
      aiEngine: {
        opportunityScore: c.opportunityScore ?? 82,
        suggestedAcreage: parseFloat(c.suggestedAcreage ?? "50"),
        yieldProjectionTons: parseFloat(c.yieldProjectionTons ?? "200"),
        revenueProjectionUsd: parseFloat(c.revenueProjectionUsd ?? "80000"),
        targetBuyers: (c.topBuyers as string[]).slice(0, 3),
        bestPlantingMonths: ["March", "April", "September"],
        cropRotationSuggestions: ["Beans", "Maize", "Cover crops"],
      },
      alerts: await db.select().from(marketAlertsTable).then((a) =>
        a.slice(0, 5).map((al) => ({
          id: al.id,
          type: al.type,
          commodity: al.commodity,
          message: al.message,
          severity: al.severity,
          region: al.region,
          createdAt: al.createdAt.toISOString(),
        }))
      ),
      historicalPrices: history.map((h) => ({ date: h.date, price: parseFloat(h.price) })),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting commodity detail");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/buyers", async (req, res) => {
  try {
    const { commodity, region, type } = req.query as Record<string, string>;
    const buyers = await db.select().from(buyersTable);
    const filtered = buyers
      .filter((b) => {
        if (commodity && !(b.commodities as string[]).some((c) => c.toLowerCase().includes(commodity.toLowerCase()))) return false;
        if (region && !b.location.toLowerCase().includes(region.toLowerCase())) return false;
        if (type && b.type !== type) return false;
        return true;
      })
      .map((b) => ({
        id: b.id,
        name: b.name,
        location: b.location,
        type: b.type,
        weeklyDemandTons: parseFloat(b.weeklyDemandTons),
        monthlyDemandTons: parseFloat(b.monthlyDemandTons),
        yearlyDemandTons: parseFloat(b.yearlyDemandTons),
        sustainabilityScore: b.sustainabilityScore,
        aiMatchScore: b.aiMatchScore,
        tradeReadiness: b.tradeReadiness,
        currency: b.currency,
        commodities: b.commodities as string[],
        isAiRecommended: b.isAiRecommended,
      }));
    res.json(filtered);
  } catch (err) {
    req.log.error({ err }, "Error listing buyers");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/market/verify-pin", async (req, res) => {
  const { pin } = req.body;
  if (pin === "1234" || pin === "0000") {
    res.json({ success: true, accessToken: "market-hub-access-granted", message: "Access granted to Market Hub" });
  } else {
    res.json({ success: false, accessToken: "", message: "Invalid PIN. Please try again." });
  }
});

router.get("/market/alerts", async (req, res) => {
  try {
    const alerts = await db.select().from(marketAlertsTable);
    res.json(alerts.map((a) => ({
      id: a.id,
      type: a.type,
      commodity: a.commodity,
      message: a.message,
      severity: a.severity,
      region: a.region,
      createdAt: a.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing alerts");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
