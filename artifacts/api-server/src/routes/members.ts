import { Router } from "express";
import { db } from "@workspace/db";
import { membersTable, connectionsTable } from "@workspace/db";
import { eq, and, or, ilike } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { region, sector, role, commodity } = req.query as Record<string, string>;
    let query = db.select().from(membersTable);
    const conditions = [];
    if (region) conditions.push(ilike(membersTable.region, `%${region}%`));
    if (sector) conditions.push(ilike(membersTable.sector, `%${sector}%`));
    if (role) conditions.push(eq(membersTable.role, role as any));
    if (commodity) conditions.push(ilike(membersTable.commodity!, `%${commodity}%`));

    const members = conditions.length > 0
      ? await db.select().from(membersTable).where(and(...conditions))
      : await db.select().from(membersTable);

    const result = members.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      sector: m.sector,
      region: m.region,
      country: m.country,
      commodity: m.commodity,
      businessType: m.businessType,
      bio: m.bio,
      avatarUrl: m.avatarUrl,
      isVerified: m.isVerified,
      isConnected: false,
      joinedAt: m.joinedAt.toISOString(),
      metrics: {
        revenue: parseFloat(m.revenueUsd ?? "0"),
        jobsCreated: m.jobsCreated ?? 0,
        yieldTons: parseFloat(m.yieldTons ?? "0"),
        growthPercent: parseFloat(m.growthPercent ?? "0"),
      },
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error listing members");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [member] = await db.select().from(membersTable).where(eq(membersTable.id, id));
    if (!member) return res.status(404).json({ error: "Member not found" });
    res.json({
      id: member.id,
      name: member.name,
      role: member.role,
      sector: member.sector,
      region: member.region,
      country: member.country,
      commodity: member.commodity,
      businessType: member.businessType,
      bio: member.bio,
      avatarUrl: member.avatarUrl,
      isVerified: member.isVerified,
      isConnected: false,
      joinedAt: member.joinedAt.toISOString(),
      metrics: {
        revenue: parseFloat(member.revenueUsd ?? "0"),
        jobsCreated: member.jobsCreated ?? 0,
        yieldTons: parseFloat(member.yieldTons ?? "0"),
        growthPercent: parseFloat(member.growthPercent ?? "0"),
      },
    });
  } catch (err) {
    req.log.error({ err }, "Error getting member");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, role, sector, region, country, commodity, businessType, bio } = req.body;
    const [member] = await db.insert(membersTable).values({
      name, role, sector, region, country, commodity, businessType, bio,
    }).returning();
    res.status(201).json({ ...member, isConnected: false, metrics: { revenue: 0, jobsCreated: 0 } });
  } catch (err) {
    req.log.error({ err }, "Error creating member");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/connect", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.insert(connectionsTable).values({ fromMemberId: 1, toMemberId: id }).onConflictDoNothing();
    res.json({ success: true, message: "Connected successfully. Messaging and deeper profile unlocked.", memberId: id });
  } catch (err) {
    req.log.error({ err }, "Error connecting");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
