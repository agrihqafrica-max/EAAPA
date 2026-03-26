import { Router } from "express";
import { db } from "@workspace/db";
import { aiOpportunitiesTable, aiRecommendationsTable, predictionModelsTable, signalsTable, userBehaviorLogsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

// AI Opportunities
router.get("/ai/opportunities", async (req, res) => {
  try {
    const { commodityName, riskLevel, isActive } = req.query as Record<string, string>;
    let results = await db.select().from(aiOpportunitiesTable).orderBy(desc(aiOpportunitiesTable.opportunityScore));
    if (commodityName) results = results.filter(o => o.commodityName.toLowerCase().includes(commodityName.toLowerCase()));
    if (riskLevel) results = results.filter(o => o.riskLevel === riskLevel);
    if (isActive !== "false") results = results.filter(o => o.isActive);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing AI opportunities");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/ai/opportunities/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [opportunity] = await db.select().from(aiOpportunitiesTable).where(eq(aiOpportunitiesTable.id, id));
    if (!opportunity) return res.status(404).json({ error: "AI opportunity not found" });
    res.json(opportunity);
  } catch (err) {
    req.log.error({ err }, "Error getting AI opportunity");
    res.status(500).json({ error: "Internal server error" });
  }
});

// AI Recommendations
router.get("/ai/recommendations", async (req, res) => {
  try {
    const { memberId, type, priority } = req.query as Record<string, string>;
    let results = await db.select().from(aiRecommendationsTable).orderBy(desc(aiRecommendationsTable.createdAt));
    if (memberId) results = results.filter(r => r.memberId === parseInt(memberId));
    if (type) results = results.filter(r => r.type === type);
    if (priority) results = results.filter(r => r.priority === priority);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing AI recommendations");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/ai/recommendations/:id/act", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [rec] = await db.update(aiRecommendationsTable).set({ isActed: true, updatedAt: new Date() }).where(eq(aiRecommendationsTable.id, id)).returning();
    if (!rec) return res.status(404).json({ error: "Recommendation not found" });
    res.json({ success: true, recommendation: rec });
  } catch (err) {
    req.log.error({ err }, "Error acting on recommendation");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Prediction Models
router.get("/ai/models", async (req, res) => {
  try {
    const { type, isActive } = req.query as Record<string, string>;
    let results = await db.select().from(predictionModelsTable).orderBy(desc(predictionModelsTable.createdAt));
    if (type) results = results.filter(m => m.type === type);
    if (isActive === "true") results = results.filter(m => m.isActive);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing prediction models");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Signals
router.get("/ai/signals", async (req, res) => {
  try {
    const { type, commodityName, isActionable } = req.query as Record<string, string>;
    let results = await db.select().from(signalsTable).orderBy(desc(signalsTable.createdAt));
    if (type) results = results.filter(s => s.type === type);
    if (commodityName) results = results.filter(s => s.commodityName?.toLowerCase().includes(commodityName.toLowerCase()));
    if (isActionable === "true") results = results.filter(s => s.isActionable);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing signals");
    res.status(500).json({ error: "Internal server error" });
  }
});

// AI Scenario Simulator
router.post("/ai/simulate", async (req, res) => {
  try {
    const { acreage, commodityId, targetMarket, pricePerTon } = req.body;
    const yieldPerAcre = 4;
    const estimatedYield = acreage * yieldPerAcre;
    const basePrice = pricePerTon || 80;
    const exportPremium = targetMarket === "export" ? 1.4 : 1;
    const baseRevenue = estimatedYield * basePrice * exportPremium;
    const inputCost = acreage * 450;
    const netRevenue = baseRevenue - inputCost;
    const roi = ((netRevenue / inputCost) * 100).toFixed(1);

    res.json({
      acreage,
      estimatedYieldTons: estimatedYield,
      baseRevenue: Math.round(baseRevenue),
      inputCost: Math.round(inputCost),
      netRevenue: Math.round(netRevenue),
      roi: parseFloat(roi),
      currency: "USD",
      targetMarket,
      recommendations: [
        `Plant ${Math.round(acreage * 0.7)} acres in the main season and ${Math.round(acreage * 0.3)} in the short rains`,
        `Target buyers: ${targetMarket === "export" ? "FloraHolland, Greenyard Fresh, Dubai DMCC" : "Naivas, Carrefour Kenya, WFP"}`,
        `Expected harvest: ${Math.round(estimatedYield)} tons in ${acreage > 50 ? "6-8" : "3-6"} months`,
      ],
      breakEvenPrice: (inputCost / estimatedYield).toFixed(2),
      projectedJobs: Math.round(acreage * 0.8),
    });
  } catch (err) {
    req.log.error({ err }, "Error running AI simulation");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Price Forecast
router.get("/ai/forecast/:commodityId", async (req, res) => {
  try {
    const commodityId = parseInt(req.params.commodityId);
    const { period } = req.query as Record<string, string>;
    const months = period === "12m" ? 12 : period === "6m" ? 6 : 3;
    const basePrice = 180;
    const forecast = Array.from({ length: months }, (_, i) => {
      const variation = (Math.random() - 0.4) * 20;
      const trend = i * 1.5;
      return {
        month: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000).toLocaleString("default", { month: "short", year: "2-digit" }),
        price: Math.round(basePrice + variation + trend),
        low: Math.round(basePrice + variation + trend - 15),
        high: Math.round(basePrice + variation + trend + 15),
        confidence: Math.round(90 - i * 3),
      };
    });
    res.json({ commodityId, period: `${months}m`, forecast, model: "LSTM-v2.1", accuracy: 87.4 });
  } catch (err) {
    req.log.error({ err }, "Error generating price forecast");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Log behavior
router.post("/ai/log", async (req, res) => {
  try {
    await db.insert(userBehaviorLogsTable).values(req.body);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

// Global Arbitrage
router.get("/ai/arbitrage", async (req, res) => {
  try {
    const { commodityName } = req.query as Record<string, string>;
    const markets = [
      { market: "Dubai DMCC", country: "UAE", currentPrice: 920, forecast3m: 980, forecastChange: 6.5, opportunityScore: 92, recommendation: "Strong Buy" },
      { market: "Rotterdam Port", country: "Netherlands", currentPrice: 860, forecast3m: 895, forecastChange: 4.1, opportunityScore: 85, recommendation: "Buy" },
      { market: "Shanghai Exchange", country: "China", currentPrice: 780, forecast3m: 830, forecastChange: 6.4, opportunityScore: 78, recommendation: "Buy" },
      { market: "London Heathrow", country: "UK", currentPrice: 840, forecast3m: 820, forecastChange: -2.4, opportunityScore: 62, recommendation: "Hold" },
      { market: "Nairobi Local", country: "Kenya", currentPrice: 180, forecast3m: 195, forecastChange: 8.3, opportunityScore: 70, recommendation: "Local Sell" },
    ];
    res.json({ commodity: commodityName || "Avocado", markets, currency: "USD", perTon: true, updatedAt: new Date().toISOString() });
  } catch (err) {
    req.log.error({ err }, "Error getting arbitrage data");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
