import { Router } from "express";
import { db } from "@workspace/db";
import { investmentsTable, grantsTable, loansTable, fundingRoundsTable, fundingApplicationsTable, disbursementsTable, repaymentsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

// Investments
router.get("/investments", async (req, res) => {
  try {
    const { investorId, sector, status, stage } = req.query as Record<string, string>;
    let results = await db.select().from(investmentsTable).orderBy(desc(investmentsTable.createdAt));
    if (investorId) results = results.filter(i => i.investorId === parseInt(investorId));
    if (sector) results = results.filter(i => i.sector?.toLowerCase().includes(sector.toLowerCase()));
    if (status) results = results.filter(i => i.status === status);
    if (stage) results = results.filter(i => i.stage === stage);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing investments");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/investments/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [investment] = await db.select().from(investmentsTable).where(eq(investmentsTable.id, id));
    if (!investment) return res.status(404).json({ error: "Investment not found" });
    res.json(investment);
  } catch (err) {
    req.log.error({ err }, "Error getting investment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/investments", async (req, res) => {
  try {
    const [investment] = await db.insert(investmentsTable).values(req.body).returning();
    res.status(201).json(investment);
  } catch (err) {
    req.log.error({ err }, "Error creating investment");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Grants
router.get("/grants", async (req, res) => {
  try {
    const { sector, country, isOpen } = req.query as Record<string, string>;
    let results = await db.select().from(grantsTable).orderBy(desc(grantsTable.createdAt));
    if (sector) results = results.filter(g => g.sector?.toLowerCase().includes(sector.toLowerCase()));
    if (country) results = results.filter(g => g.country?.toLowerCase() === country.toLowerCase());
    if (isOpen === "true") results = results.filter(g => g.isOpen);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing grants");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/grants/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [grant] = await db.select().from(grantsTable).where(eq(grantsTable.id, id));
    if (!grant) return res.status(404).json({ error: "Grant not found" });
    res.json(grant);
  } catch (err) {
    req.log.error({ err }, "Error getting grant");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/grants", async (req, res) => {
  try {
    const [grant] = await db.insert(grantsTable).values(req.body).returning();
    res.status(201).json(grant);
  } catch (err) {
    req.log.error({ err }, "Error creating grant");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Funding Rounds
router.get("/funding-rounds", async (req, res) => {
  try {
    const { stage, sector, isActive } = req.query as Record<string, string>;
    let results = await db.select().from(fundingRoundsTable).orderBy(desc(fundingRoundsTable.createdAt));
    if (stage) results = results.filter(r => r.stage === stage);
    if (sector) results = results.filter(r => r.sector?.toLowerCase().includes(sector.toLowerCase()));
    if (isActive === "true") results = results.filter(r => r.isActive);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing funding rounds");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/funding-rounds", async (req, res) => {
  try {
    const [round] = await db.insert(fundingRoundsTable).values(req.body).returning();
    res.status(201).json(round);
  } catch (err) {
    req.log.error({ err }, "Error creating funding round");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Loans
router.get("/loans", async (req, res) => {
  try {
    const { borrowerId, status } = req.query as Record<string, string>;
    let results = await db.select().from(loansTable).orderBy(desc(loansTable.createdAt));
    if (borrowerId) results = results.filter(l => l.borrowerId === parseInt(borrowerId));
    if (status) results = results.filter(l => l.status === status);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing loans");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/loans/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [loan] = await db.select().from(loansTable).where(eq(loansTable.id, id));
    if (!loan) return res.status(404).json({ error: "Loan not found" });
    const repayments = await db.select().from(repaymentsTable).where(eq(repaymentsTable.loanId, id));
    res.json({ ...loan, repayments });
  } catch (err) {
    req.log.error({ err }, "Error getting loan");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/loans", async (req, res) => {
  try {
    const [loan] = await db.insert(loansTable).values(req.body).returning();
    res.status(201).json(loan);
  } catch (err) {
    req.log.error({ err }, "Error creating loan");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/loans/:id/repayments", async (req, res) => {
  try {
    const loanId = parseInt(req.params.id);
    const [repayment] = await db.insert(repaymentsTable).values({ ...req.body, loanId }).returning();
    const [loan] = await db.select().from(loansTable).where(eq(loansTable.id, loanId));
    if (loan) {
      const newRepaid = parseFloat(loan.amountRepaid as string) + parseFloat(req.body.amount);
      await db.update(loansTable).set({ amountRepaid: newRepaid.toString(), updatedAt: new Date() }).where(eq(loansTable.id, loanId));
    }
    res.status(201).json(repayment);
  } catch (err) {
    req.log.error({ err }, "Error recording repayment");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Funding Applications
router.get("/funding-applications", async (req, res) => {
  try {
    const { applicantId, status } = req.query as Record<string, string>;
    let results = await db.select().from(fundingApplicationsTable).orderBy(desc(fundingApplicationsTable.createdAt));
    if (applicantId) results = results.filter(a => a.applicantId === parseInt(applicantId));
    if (status) results = results.filter(a => a.status === status);
    res.json(results);
  } catch (err) {
    req.log.error({ err }, "Error listing funding applications");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/funding-applications", async (req, res) => {
  try {
    const [application] = await db.insert(fundingApplicationsTable).values({ ...req.body, status: "submitted", submittedAt: new Date() }).returning();
    res.status(201).json(application);
  } catch (err) {
    req.log.error({ err }, "Error creating funding application");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/funding-applications/:id/review", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, reviewNotes } = req.body;
    const [application] = await db.update(fundingApplicationsTable).set({ status, reviewNotes, reviewedAt: new Date(), updatedAt: new Date() }).where(eq(fundingApplicationsTable.id, id)).returning();
    if (!application) return res.status(404).json({ error: "Application not found" });
    res.json(application);
  } catch (err) {
    req.log.error({ err }, "Error reviewing application");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Summary stats
router.get("/finance/summary", async (req, res) => {
  try {
    const investments = await db.select().from(investmentsTable);
    const loans = await db.select().from(loansTable);
    const grants = await db.select().from(grantsTable);
    const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount as string), 0);
    const totalLoaned = loans.reduce((sum, l) => sum + parseFloat(l.principal as string), 0);
    const activeLoans = loans.filter(l => l.status === "active").length;
    const activeGrants = grants.filter(g => g.isOpen).length;
    res.json({
      totalInvested,
      totalLoaned,
      activeLoans,
      activeGrants,
      investmentCount: investments.length,
      loanCount: loans.length,
      grantCount: grants.length,
    });
  } catch (err) {
    req.log.error({ err }, "Error getting finance summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
