import { Router } from "express";
import { db } from "@workspace/db";
import { dashboardsTable, dashboardWidgetsTable, kpisTable, reportsTable, impactMetricsTable, priceTrendsTable, demandSignalsTable, supplySignalsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { membersTable, commoditiesTable, opportunitiesTable, eventsTable, trainingProgramsTable, investmentsTable, loansTable } from "@workspace/db";

const router = Router();

// Dynamic Dashboard KPIs (aggregated live)
router.get("/dashboard/kpis", async (req, res) => {
  try {
    const { role } = req.query as Record<string, string>;
    const members = await db.select().from(membersTable);
    const commodities = await db.select().from(commoditiesTable);
    const opportunities = await db.select().from(opportunitiesTable);
    const events = await db.select().from(eventsTable);
    const investments = await db.select().from(investmentsTable);
    const loans = await db.select().from(loansTable);

    const agripreneurs = members.filter(m => m.role === "agripreneur").length;
    const investors = members.filter(m => m.role === "investor").length;
    const mentors = members.filter(m => m.role === "mentor").length;
    const partners = members.filter(m => m.role === "partner").length;
    const totalJobs = members.reduce((sum, m) => sum + (m.jobsCreated || 0), 0);
    const totalRevenue = members.reduce((sum, m) => sum + parseFloat(m.revenueUsd as string || "0"), 0);
    const totalInvested = investments.reduce((sum, i) => sum + parseFloat(i.amount as string), 0);
    const activeLoans = loans.filter(l => l.status === "active");
    const loanPortfolio = activeLoans.reduce((sum, l) => sum + parseFloat(l.principal as string), 0);

    const kpis = [
      { id: "total_members", label: "Total Members", value: members.length, change: 12.4, unit: "members", icon: "Users", category: "membership" },
      { id: "agripreneurs", label: "Agripreneurs", value: agripreneurs, change: 18.2, unit: "farmers", icon: "Leaf", category: "membership" },
      { id: "investors", label: "Investors", value: investors, change: 8.1, unit: "investors", icon: "TrendingUp", category: "financial" },
      { id: "mentors", label: "Mentors", value: mentors, change: 5.6, unit: "mentors", icon: "BookOpen", category: "membership" },
      { id: "total_jobs", label: "Jobs Created", value: totalJobs, change: 24.7, unit: "jobs", icon: "Briefcase", category: "impact" },
      { id: "total_revenue", label: "Total Revenue Generated", value: Math.round(totalRevenue), change: 31.2, unit: "USD", icon: "DollarSign", category: "financial" },
      { id: "commodities_tracked", label: "Commodities Tracked", value: commodities.length, change: 4.8, unit: "commodities", icon: "Package", category: "market" },
      { id: "open_opportunities", label: "Open Opportunities", value: opportunities.filter(o => o.status === "open").length, change: -2.1, unit: "opportunities", icon: "Target", category: "market" },
      { id: "upcoming_events", label: "Upcoming Events", value: events.length, change: 11.4, unit: "events", icon: "Calendar", category: "engagement" },
      { id: "investment_portfolio", label: "Total Investment Portfolio", value: Math.round(totalInvested), change: 42.3, unit: "USD", icon: "PieChart", category: "financial" },
      { id: "active_loans", label: "Active Loan Portfolio", value: Math.round(loanPortfolio), change: 15.8, unit: "USD", icon: "CreditCard", category: "financial" },
      { id: "countries", label: "Countries Reached", value: 8, change: 0, unit: "countries", icon: "Globe", category: "impact" },
    ];

    res.json(kpis);
  } catch (err) {
    req.log.error({ err }, "Error getting dashboard KPIs");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Role-based dashboards
router.get("/dashboard/:role", async (req, res) => {
  try {
    const { role } = req.params;
    const dashboards = await db.select().from(dashboardsTable).where(eq(dashboardsTable.role, role));
    if (!dashboards.length) {
      return res.json({ role, message: "No dashboard configured for this role", widgets: [] });
    }
    const dashboard = dashboards[0];
    const widgets = await db.select().from(dashboardWidgetsTable).where(eq(dashboardWidgetsTable.dashboardId, dashboard.id));
    res.json({ ...dashboard, widgets });
  } catch (err) {
    req.log.error({ err }, "Error getting dashboard");
    res.status(500).json({ error: "Internal server error" });
  }
});

// KPIs
router.get("/kpis", async (req, res) => {
  try {
    const { category } = req.query as Record<string, string>;
    let results = await db.select().from(kpisTable).orderBy(desc(kpisTable.updatedAt));
    if (category) results = results.filter(k => k.category === category);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing KPIs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/kpis", async (req, res) => {
  try {
    const [kpi] = await db.insert(kpisTable).values(req.body).returning();
    res.status(201).json(kpi);
  } catch (err) {
    req.log.error({ err }, "Error creating KPI");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/kpis/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [kpi] = await db.update(kpisTable).set({ ...req.body, updatedAt: new Date() }).where(eq(kpisTable.id, id)).returning();
    if (!kpi) return res.status(404).json({ error: "KPI not found" });
    res.json(kpi);
  } catch (err) {
    req.log.error({ err }, "Error updating KPI");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Reports
router.get("/reports", async (req, res) => {
  try {
    const { type, status } = req.query as Record<string, string>;
    let results = await db.select().from(reportsTable).orderBy(desc(reportsTable.createdAt));
    if (type) results = results.filter(r => r.type === type);
    if (status) results = results.filter(r => r.status === status);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing reports");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reports", async (req, res) => {
  try {
    const [report] = await db.insert(reportsTable).values({ ...req.body, status: "generating", lastRanAt: new Date() }).returning();
    setTimeout(async () => {
      await db.update(reportsTable).set({ status: "ready" }).where(eq(reportsTable.id, report.id));
    }, 2000);
    res.status(201).json(report);
  } catch (err) {
    req.log.error({ err }, "Error creating report");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Price Trends
router.get("/price-trends", async (req, res) => {
  try {
    const { commodityId, country } = req.query as Record<string, string>;
    let results = await db.select().from(priceTrendsTable).orderBy(desc(priceTrendsTable.createdAt));
    if (commodityId) results = results.filter(t => t.commodityId === parseInt(commodityId));
    if (country) results = results.filter(t => t.country?.toLowerCase() === country.toLowerCase());
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing price trends");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Demand Signals
router.get("/demand-signals", async (req, res) => {
  try {
    const { commodityName } = req.query as Record<string, string>;
    let results = await db.select().from(demandSignalsTable).orderBy(desc(demandSignalsTable.createdAt));
    if (commodityName) results = results.filter(s => s.commodityName.toLowerCase().includes(commodityName.toLowerCase()));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing demand signals");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Supply Signals
router.get("/supply-signals", async (req, res) => {
  try {
    const results = await db.select().from(supplySignalsTable).orderBy(desc(supplySignalsTable.createdAt));
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing supply signals");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Impact Metrics
router.get("/impact-metrics-data", async (req, res) => {
  try {
    const { category, country } = req.query as Record<string, string>;
    let results = await db.select().from(impactMetricsTable).orderBy(desc(impactMetricsTable.createdAt));
    if (category) results = results.filter(m => m.category === category);
    if (country) results = results.filter(m => m.country?.toLowerCase() === country.toLowerCase());
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing impact metrics");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
