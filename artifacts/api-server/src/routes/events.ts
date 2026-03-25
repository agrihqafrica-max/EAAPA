import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable, resourcesTable, successStoriesTable, mentorsTable, knowledgeTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/events", async (req, res) => {
  try {
    const { type } = req.query as Record<string, string>;
    let events = await db.select().from(eventsTable);
    if (type) events = events.filter((e) => e.type === type);
    res.json(events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      type: e.type,
      location: e.location,
      country: e.country,
      startDate: e.startDate,
      endDate: e.endDate,
      registrationDeadline: e.registrationDeadline,
      attendees: e.attendees,
      maxAttendees: e.maxAttendees,
      isRegistered: false,
      isFeatured: e.isFeatured,
      tags: e.tags as string[],
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing events");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/events/:id/register", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
    if (!event) return res.status(404).json({ error: "Event not found" });
    await db.update(eventsTable).set({ attendees: event.attendees + 1 }).where(eq(eventsTable.id, id));
    res.json({ ...event, attendees: event.attendees + 1, isRegistered: true, tags: event.tags as string[] });
  } catch (err) {
    req.log.error({ err }, "Error registering for event");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/resources", async (req, res) => {
  try {
    const { category } = req.query as Record<string, string>;
    let resources = await db.select().from(resourcesTable);
    if (category) resources = resources.filter((r) => r.category === category);
    res.json(resources.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      fileType: r.fileType,
      fileSize: r.fileSize,
      author: r.author,
      publishedAt: r.publishedAt,
      downloads: r.downloads,
      tags: r.tags as string[],
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing resources");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/impact/metrics", async (req, res) => {
  try {
    const { default: pg } = await import("pg");
    const Pool = pg.Pool;
    res.json({
      totalAgripreneurs: 4287,
      totalInvestors: 342,
      totalMentors: 128,
      totalPartners: 89,
      marketValueUsd: 284000000,
      totalJobsCreated: 18420,
      countriesReached: 8,
      commoditiesTracked: 47,
      successStoriesCount: 156,
      regionalImpact: [
        { region: "Central Kenya", country: "Kenya", agripreneurs: 1240, marketValueUsd: 98000000, jobs: 6200 },
        { region: "Rift Valley", country: "Kenya", agripreneurs: 890, marketValueUsd: 72000000, jobs: 4100 },
        { region: "Central Uganda", country: "Uganda", agripreneurs: 680, marketValueUsd: 45000000, jobs: 3200 },
        { region: "Northern Tanzania", country: "Tanzania", agripreneurs: 520, marketValueUsd: 38000000, jobs: 2800 },
        { region: "Kigali", country: "Rwanda", agripreneurs: 380, marketValueUsd: 19000000, jobs: 1400 },
        { region: "Addis Ababa", country: "Ethiopia", agripreneurs: 290, marketValueUsd: 12000000, jobs: 720 },
      ],
    });
  } catch (err) {
    req.log.error({ err }, "Error getting impact metrics");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/impact/stories", async (req, res) => {
  try {
    const stories = await db.select().from(successStoriesTable);
    res.json(stories.map((s) => ({
      id: s.id,
      agripreneurName: s.agripreneurName,
      title: s.title,
      story: s.story,
      sector: s.sector,
      region: s.region,
      country: s.country,
      revenueUsd: s.revenueUsd,
      jobsCreated: s.jobsCreated,
      growthPercent: s.growthPercent,
      commodities: s.commodities as string[],
      publishedAt: s.publishedAt,
      avatarUrl: s.avatarUrl,
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing stories");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/mentors", async (req, res) => {
  try {
    const { sector } = req.query as Record<string, string>;
    let mentors = await db.select().from(mentorsTable);
    if (sector) mentors = mentors.filter((m) => m.sector.toLowerCase().includes(sector.toLowerCase()));
    res.json(mentors.map((m) => ({
      id: m.id,
      name: m.name,
      expertise: m.expertise as string[],
      sector: m.sector,
      country: m.country,
      bio: m.bio,
      menteeCount: m.menteeCount,
      rating: m.rating / 10,
      isAvailable: m.isAvailable,
      avatarUrl: m.avatarUrl,
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing mentors");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/knowledge", async (req, res) => {
  try {
    const { category } = req.query as Record<string, string>;
    let items = await db.select().from(knowledgeTable);
    if (category) items = items.filter((k) => k.category === category);
    res.json(items.map((k) => ({
      id: k.id,
      title: k.title,
      description: k.description,
      category: k.category,
      tags: k.tags as string[],
      views: k.views,
      author: k.author,
      publishedAt: k.publishedAt,
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing knowledge");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
